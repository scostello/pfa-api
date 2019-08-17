#!/usr/bin/env sh

set -e

script="${1:-start}"

exec yarn run ${script}
