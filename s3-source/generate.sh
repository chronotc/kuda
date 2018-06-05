#!/bin/sh

set -euo pipefail

echo HELLO1 > dist/artifact
echo HELLO2 > dist/artifact2
echo HELLO3 > dist/artifact3

echo $SILLA