#!/usr/bin/env python3
import bcrypt
import sys

if len(sys.argv) < 2:
    print("Usage: python bcrypt_encode.py <password>")
    exit(1)

password = sys.argv[1].encode("utf-8")

# Generate bcrypt hash with cost factor 12 (secure)
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))

print(hashed.decode())
