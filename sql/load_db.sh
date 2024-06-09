#!/bin/bash

psql -h localhost -p 7777 -U enslipch -d enslipch -f tables.sql
