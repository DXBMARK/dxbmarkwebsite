#!/usr/bin/env bash

set -e

# =========================
# SpecKit Enhanced Preflight Gate
# =========================
#
# Usage: ./check-prerequisites.sh [OPTIONS]
#
# OPTIONS:
#   --json              Output in JSON format
#   --require-tasks     Require tasks.md to exist (for implementation phase)
#   --include-tasks     Include tasks.md in AVAILABLE_DOCS list
#   --paths-only        Only output path variables (no validation)
#   --help, -h          Show help message
#
# OUTPUTS:
#   JSON mode: Full readiness report with score, phase, env/integration checks
#   Text mode: Human-readable readiness report
#   Paths only: REPO_ROOT, BRANCH, FEATURE_DIR, etc.

JSON_MODE=false
REQUIRE_TASKS=false
INCLUDE_TASKS=false
PATHS_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --json)          JSON_MODE=true ;;
    --require-tasks) REQUIRE_TASKS=true ;;
    --include-tasks) INCLUDE_TASKS=true ;;
    --paths-only)    PATHS_ONLY=true ;;
    --help|-h)
      cat <<'EOF'
Usage: check-prerequisites.sh [OPTIONS]

Enhanced SpecKit Preflight Gate — CI-style readiness check.

OPTIONS:
  --json              Output in JSON format
  --require-tasks     Require tasks.md to exist (for implementation phase)
  --include-tasks     Include tasks.md in AVAILABLE_DOCS list
  --paths-only        Only output path variables (no prerequisite validation)
  --help, -h          Show this help message

EXAMPLES:
  # Full readiness check (text output)
  ./check-prerequisites.sh

  # Full readiness check (JSON output for agents)
  ./check-prerequisites.sh --json

  # Implementation phase check (requires tasks.md)
  ./check-prerequisites.sh --json --require-tasks --include-tasks

  # Get feature paths only
  ./check-prerequisites.sh --paths-only

EOF
      exit 0
      ;;
    *)
      echo "ERROR: Unknown option '$arg'. Use --help for usage information." >&2
      exit 1
      ;;
  esac
done

# Source common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# =========================
# HELPERS
# =========================

# Log helpers (text mode only)
log_ok()   { echo "  ✅ $1"; }
log_warn() { echo "  ⚠️  $1"; }
log_fail() { echo "  ❌ $1"; }

# =========================
# PATH RESOLUTION
# =========================

if $PATHS_ONLY; then
  _paths_output=$(get_feature_paths --no-persist) || { echo "ERROR: Failed to resolve feature paths" >&2; exit 1; }
else
  _paths_output=$(get_feature_paths) || { echo "ERROR: Failed to resolve feature paths" >&2; exit 1; }
fi
eval "$_paths_output"
unset _paths_output

# --paths-only: output and exit early
if $PATHS_ONLY; then
  if $JSON_MODE; then
    if has_jq; then
      jq -cn \
        --arg repo_root    "$REPO_ROOT" \
        --arg branch       "$CURRENT_BRANCH" \
        --arg feature_dir  "$FEATURE_DIR" \
        --arg feature_spec "$FEATURE_SPEC" \
        --arg impl_plan    "$IMPL_PLAN" \
        --arg tasks        "$TASKS" \
        '{REPO_ROOT:$repo_root,BRANCH:$branch,FEATURE_DIR:$feature_dir,FEATURE_SPEC:$feature_spec,IMPL_PLAN:$impl_plan,TASKS:$tasks}'
    else
      printf '{"REPO_ROOT":"%s","BRANCH":"%s","FEATURE_DIR":"%s","FEATURE_SPEC":"%s","IMPL_PLAN":"%s","TASKS":"%s"}\n' \
        "$(json_escape "$REPO_ROOT")" "$(json_escape "$CURRENT_BRANCH")" \
        "$(json_escape "$FEATURE_DIR")" "$(json_escape "$FEATURE_SPEC")" \
        "$(json_escape "$IMPL_PLAN")" "$(json_escape "$TASKS")"
    fi
  else
    echo "REPO_ROOT: $REPO_ROOT"
    echo "BRANCH: $CURRENT_BRANCH"
    echo "FEATURE_DIR: $FEATURE_DIR"
    echo "FEATURE_SPEC: $FEATURE_SPEC"
    echo "IMPL_PLAN: $IMPL_PLAN"
    echo "TASKS: $TASKS"
  fi
  exit 0
fi

# =========================
# SCORE ENGINE
# =========================

TOTAL_SCORE=0
MAX_SCORE=0

add_score() {
  local points="$1"
  local earned="$2"   # 0 or $points
  MAX_SCORE=$((MAX_SCORE + points))
  TOTAL_SCORE=$((TOTAL_SCORE + earned))
}

# =========================
# 1. ENV VALIDATION (30 pts)
# =========================

ENV_STATUS="ok"
declare -a MISSING_ENV=()
declare -a WARNED_ENV=()

# Required env vars
REQUIRED_ENV_VARS=(
  DATABASE_URL
  STRIPE_SECRET_KEY
  QSTASH_URL
  QSTASH_TOKEN
)

# Optional but recommended
OPTIONAL_ENV_VARS=(
  STRIPE_WEBHOOK_SECRET
  QSTASH_CURRENT_SIGNING_KEY
  QSTASH_NEXT_SIGNING_KEY
  NEXT_PUBLIC_APP_URL
)

for var in "${REQUIRED_ENV_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    MISSING_ENV+=("$var")
  fi
done

for var in "${OPTIONAL_ENV_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    WARNED_ENV+=("$var")
  fi
done

if [[ ${#MISSING_ENV[@]} -gt 0 ]]; then
  ENV_STATUS="missing"
  add_score 30 0
elif [[ ${#WARNED_ENV[@]} -gt 0 ]]; then
  ENV_STATUS="partial"
  add_score 30 15
else
  ENV_STATUS="ok"
  add_score 30 30
fi

# =========================
# 2. INTEGRATION CHECKS (30 pts)
# =========================

DB_STATUS="unknown"
QUEUE_STATUS="unknown"
STRIPE_STATUS="unknown"
INTEGRATION_SCORE=0

# 2a. Database connectivity (10 pts)
# Uses .specify/scripts/check-db.js (requires @neondatabase/serverless from project node_modules)
if [[ -n "${DATABASE_URL:-}" ]]; then
  if command -v node &>/dev/null; then
    # Resolve project root (3 levels up from bash/ → scripts/ → .specify/ → root)
    _PROJECT_ROOT="$(CDPATH="" cd "$SCRIPT_DIR/../../.." && pwd)"
    _CHECK_DB_SCRIPT="$_PROJECT_ROOT/.specify/scripts/check-db.js"

    if [[ -f "$_CHECK_DB_SCRIPT" ]]; then
      DB_CHECK=$(cd "$_PROJECT_ROOT" && node "$_CHECK_DB_SCRIPT" 2>/dev/null | tail -1 || echo "fail")
      case "$DB_CHECK" in
        ok)   DB_STATUS="ok";   INTEGRATION_SCORE=$((INTEGRATION_SCORE + 10)) ;;
        fail) DB_STATUS="fail" ;;
        *)    DB_STATUS="fail" ;;
      esac
    else
      # Fallback: inline check via pg if check-db.js is missing
      DB_CHECK=$(node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect()
  .then(() => { console.log('ok'); client.end(); })
  .catch((e) => { console.log('fail'); process.exit(0); });
" 2>/dev/null || echo "skip")
      case "$DB_CHECK" in
        ok)   DB_STATUS="ok";   INTEGRATION_SCORE=$((INTEGRATION_SCORE + 10)) ;;
        fail) DB_STATUS="fail" ;;
        *)    DB_STATUS="skip" ;;
      esac
    fi
  else
    DB_STATUS="skip"
  fi
fi

# 2b. QStash reachability (10 pts)
if [[ -n "${QSTASH_TOKEN:-}" ]] && [[ -n "${QSTASH_URL:-}" ]]; then
  if command -v curl &>/dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: Bearer ${QSTASH_TOKEN}" \
      "${QSTASH_URL}/v2/queues" \
      --max-time 5 2>/dev/null || echo "000")
    if [[ "$HTTP_CODE" =~ ^2 ]]; then
      QUEUE_STATUS="ok"
      INTEGRATION_SCORE=$((INTEGRATION_SCORE + 10))
    elif [[ "$HTTP_CODE" == "000" ]]; then
      QUEUE_STATUS="timeout"
    else
      QUEUE_STATUS="fail"
    fi
  else
    QUEUE_STATUS="skip"
  fi
fi

# 2c. Stripe key prefix check (10 pts) — no network call needed
if [[ -n "${STRIPE_SECRET_KEY:-}" ]]; then
  if [[ "$STRIPE_SECRET_KEY" == sk_live_* ]] || [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
    STRIPE_STATUS="ok"
    INTEGRATION_SCORE=$((INTEGRATION_SCORE + 10))
  else
    STRIPE_STATUS="invalid_format"
  fi
fi

add_score 30 $INTEGRATION_SCORE

# =========================
# 3. PHASE DETECTION (20 pts)
# =========================

PHASE="unknown"
PHASE_SCORE=0

SPEC_EXISTS=false
PLAN_EXISTS=false
TASKS_EXISTS=false

[[ -f "$FEATURE_SPEC" ]] && SPEC_EXISTS=true
[[ -f "$IMPL_PLAN" ]]    && PLAN_EXISTS=true
[[ -f "$TASKS" ]]        && TASKS_EXISTS=true

if $TASKS_EXISTS && $PLAN_EXISTS && $SPEC_EXISTS; then
  PHASE="IMPLEMENT"
  PHASE_SCORE=20
elif $PLAN_EXISTS && $SPEC_EXISTS; then
  PHASE="PLAN"
  PHASE_SCORE=15
elif $SPEC_EXISTS; then
  PHASE="SPECIFY"
  PHASE_SCORE=10
else
  PHASE="PRE_SPECIFY"
  PHASE_SCORE=0
fi

add_score 20 $PHASE_SCORE

# =========================
# 4. AVAILABLE DOCS (20 pts)
# =========================

docs=()
DOCS_SCORE=0

[[ -f "$FEATURE_SPEC" ]] && { docs+=("spec.md");      DOCS_SCORE=$((DOCS_SCORE + 5)); }
[[ -f "$IMPL_PLAN" ]]    && { docs+=("plan.md");      DOCS_SCORE=$((DOCS_SCORE + 5)); }
[[ -f "${RESEARCH:-}" ]] && { docs+=("research.md");  DOCS_SCORE=$((DOCS_SCORE + 3)); }
[[ -f "${DATA_MODEL:-}" ]] && { docs+=("data-model.md"); DOCS_SCORE=$((DOCS_SCORE + 3)); }

if [[ -d "${CONTRACTS_DIR:-}" ]] && [[ -n "$(ls -A "${CONTRACTS_DIR}" 2>/dev/null)" ]]; then
  docs+=("contracts/")
  DOCS_SCORE=$((DOCS_SCORE + 2))
fi

[[ -f "${QUICKSTART:-}" ]] && { docs+=("quickstart.md"); DOCS_SCORE=$((DOCS_SCORE + 2)); }

if ($INCLUDE_TASKS || $REQUIRE_TASKS) && [[ -f "$TASKS" ]]; then
  docs+=("tasks.md")
  DOCS_SCORE=$((DOCS_SCORE + 5))
fi

# Cap docs score at 20
[[ $DOCS_SCORE -gt 20 ]] && DOCS_SCORE=20
add_score 20 $DOCS_SCORE

# =========================
# VALIDATE REQUIRED FILES
# =========================

if [[ ! -d "$FEATURE_DIR" ]]; then
  if ! $JSON_MODE; then
    echo "ERROR: Feature directory not found: $FEATURE_DIR" >&2
    echo "Run /speckit-specify first to create the feature structure." >&2
  fi
  # Still output JSON with failure
  if $JSON_MODE && has_jq; then
    jq -cn \
      --arg score "0" \
      --arg phase "PRE_SPECIFY" \
      --arg env_status "$ENV_STATUS" \
      '{SCORE:"0/100",PHASE:$phase,ENV_STATUS:$env_status,READY:false,ERROR:"Feature directory not found"}'
  fi
  exit 1
fi

if [[ ! -f "$IMPL_PLAN" ]]; then
  if ! $JSON_MODE; then
    echo "ERROR: plan.md not found in $FEATURE_DIR" >&2
    echo "Run /speckit-plan first to create the implementation plan." >&2
  fi
  if $JSON_MODE && has_jq; then
    jq -cn \
      --arg feature_dir "$FEATURE_DIR" \
      --arg phase "$PHASE" \
      --arg env_status "$ENV_STATUS" \
      '{SCORE:"0/100",PHASE:$phase,FEATURE_DIR:$feature_dir,ENV_STATUS:$env_status,READY:false,ERROR:"plan.md not found"}'
  fi
  exit 1
fi

if $REQUIRE_TASKS && [[ ! -f "$TASKS" ]]; then
  if ! $JSON_MODE; then
    echo "ERROR: tasks.md not found in $FEATURE_DIR" >&2
    echo "Run /speckit-tasks first to create the task list." >&2
  fi
  if $JSON_MODE && has_jq; then
    jq -cn \
      --arg feature_dir "$FEATURE_DIR" \
      --arg phase "$PHASE" \
      --arg env_status "$ENV_STATUS" \
      '{SCORE:"0/100",PHASE:$phase,FEATURE_DIR:$feature_dir,ENV_STATUS:$env_status,READY:false,ERROR:"tasks.md not found"}'
  fi
  exit 1
fi

# =========================
# FINAL SCORE COMPUTATION
# =========================

FINAL_SCORE=0
if [[ $MAX_SCORE -gt 0 ]]; then
  FINAL_SCORE=$(( (TOTAL_SCORE * 100) / MAX_SCORE ))
fi

READY=false
[[ $FINAL_SCORE -ge 70 ]] && READY=true

# =========================
# OUTPUT
# =========================

if $JSON_MODE; then
  # Build docs JSON array
  if has_jq; then
    if [[ ${#docs[@]} -eq 0 ]]; then
      json_docs="[]"
    else
      json_docs=$(printf '%s\n' "${docs[@]}" | jq -R . | jq -s .)
    fi

    # Build missing env array
    if [[ ${#MISSING_ENV[@]} -eq 0 ]]; then
      json_missing_env="[]"
    else
      json_missing_env=$(printf '%s\n' "${MISSING_ENV[@]}" | jq -R . | jq -s .)
    fi

    # Build warned env array
    if [[ ${#WARNED_ENV[@]} -eq 0 ]]; then
      json_warned_env="[]"
    else
      json_warned_env=$(printf '%s\n' "${WARNED_ENV[@]}" | jq -R . | jq -s .)
    fi

    jq -cn \
      --arg score         "$FINAL_SCORE/100" \
      --arg phase         "$PHASE" \
      --arg feature_dir   "$FEATURE_DIR" \
      --arg branch        "$CURRENT_BRANCH" \
      --arg env_status    "$ENV_STATUS" \
      --argjson missing   "$json_missing_env" \
      --argjson warned    "$json_warned_env" \
      --arg db_status     "$DB_STATUS" \
      --arg queue_status  "$QUEUE_STATUS" \
      --arg stripe_status "$STRIPE_STATUS" \
      --argjson docs      "$json_docs" \
      --argjson ready     "$READY" \
      '{
        SCORE: $score,
        READY: $ready,
        PHASE: $phase,
        FEATURE_DIR: $feature_dir,
        BRANCH: $branch,
        ENV: {
          STATUS: $env_status,
          MISSING: $missing,
          WARNED: $warned
        },
        INTEGRATIONS: {
          DATABASE: $db_status,
          QUEUE: $queue_status,
          STRIPE: $stripe_status
        },
        AVAILABLE_DOCS: $docs
      }'
  else
    # Fallback without jq
    echo "{\"SCORE\":\"$FINAL_SCORE/100\",\"READY\":$READY,\"PHASE\":\"$PHASE\",\"FEATURE_DIR\":\"$(json_escape "$FEATURE_DIR")\",\"ENV_STATUS\":\"$ENV_STATUS\"}"
  fi

else
  # =========================
  # TEXT OUTPUT
  # =========================

  echo ""
  echo "======================================="
  echo " SpecKit Preflight Gate"
  echo "======================================="
  echo " Phase:   $PHASE"
  echo " Branch:  $CURRENT_BRANCH"
  echo " Score:   $FINAL_SCORE / 100"
  echo " Ready:   $READY"
  echo "======================================="

  echo ""
  echo "── ENV VALIDATION ──────────────────────"
  if [[ ${#MISSING_ENV[@]} -gt 0 ]]; then
    for v in "${MISSING_ENV[@]}"; do log_fail "MISSING: $v"; done
  else
    log_ok "All required env vars present"
  fi
  if [[ ${#WARNED_ENV[@]} -gt 0 ]]; then
    for v in "${WARNED_ENV[@]}"; do log_warn "OPTIONAL missing: $v"; done
  fi

  echo ""
  echo "── INTEGRATIONS ────────────────────────"
  case "$DB_STATUS" in
    ok)      log_ok   "Database connection: OK" ;;
    fail)    log_fail "Database connection: FAILED" ;;
    skip)    log_warn "Database connection: SKIPPED (node not available)" ;;
    unknown) log_warn "Database connection: UNKNOWN (DATABASE_URL not set)" ;;
  esac
  case "$QUEUE_STATUS" in
    ok)      log_ok   "QStash queue: OK" ;;
    fail)    log_fail "QStash queue: FAILED (HTTP $HTTP_CODE)" ;;
    timeout) log_warn "QStash queue: TIMEOUT" ;;
    skip)    log_warn "QStash queue: SKIPPED (curl not available)" ;;
    unknown) log_warn "QStash queue: UNKNOWN (credentials not set)" ;;
  esac
  case "$STRIPE_STATUS" in
    ok)             log_ok   "Stripe key format: OK" ;;
    invalid_format) log_fail "Stripe key: invalid format" ;;
    unknown)        log_warn "Stripe key: UNKNOWN (not set)" ;;
  esac

  echo ""
  echo "── PHASE & DOCUMENTS ───────────────────"
  echo "  Phase detected: $PHASE"
  $SPEC_EXISTS  && log_ok "spec.md"   || log_warn "spec.md (not found)"
  $PLAN_EXISTS  && log_ok "plan.md"   || log_warn "plan.md (not found)"
  $TASKS_EXISTS && log_ok "tasks.md"  || log_warn "tasks.md (not found)"
  [[ -f "${RESEARCH:-}" ]]   && log_ok "research.md"  || true
  [[ -f "${DATA_MODEL:-}" ]] && log_ok "data-model.md" || true
  [[ -f "${QUICKSTART:-}" ]] && log_ok "quickstart.md" || true

  if [[ ${#docs[@]} -gt 0 ]]; then
    echo ""
    echo "  Available docs: ${docs[*]}"
  fi

  echo ""
  echo "======================================="
  if $READY; then
    echo " ✅ READY TO PROCEED"
  else
    echo " ❌ NOT READY — resolve issues above"
  fi
  echo "======================================="
  echo ""
fi
