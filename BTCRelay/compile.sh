#!/bin/bash

set -e

rm -rf output
lity-v1.2.4-static --abi --bin --overwrite -o output BTCRelay.sol
