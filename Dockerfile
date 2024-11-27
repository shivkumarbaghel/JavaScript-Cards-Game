# Use the Kibana Synthetics image as the base image
#FROM elastic/synthetics:8.8.0

FROM docker.elastic.co/beats/elastic-agent-complete:8.8.2

USER root

# Install Node.js and build tools
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs build-essential

# Set npm global install directory to a writable location
RUN npm config set prefix /usr/local

# Install Node.js dependencies
RUN npm install -g kerberos dotenv

# Ensure any required directories are created or permissions are set (if needed)
#WORKDIR /opt/synthetics

#USER synthetics