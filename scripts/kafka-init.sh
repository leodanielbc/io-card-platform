#!/bin/bash
set -e

KAFKA_BROKER="kafka:29092"


echo "Creating topics..."

kafka-topics --bootstrap-server $KAFKA_BROKER --create --if-not-exists \
  --topic io.card.requested.v1 \
  --partitions 3 \
  --replication-factor 1

kafka-topics --bootstrap-server $KAFKA_BROKER --create --if-not-exists \
  --topic io.card.issued.v1 \
  --partitions 3 \
  --replication-factor 1

kafka-topics --bootstrap-server $KAFKA_BROKER --create --if-not-exists \
  --topic io.card.requested.v1.dlq \
  --partitions 1 \
  --replication-factor 1

echo "Topics created:"
kafka-topics --bootstrap-server $KAFKA_BROKER --list
