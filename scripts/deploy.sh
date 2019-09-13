#!/usr/bin/env bash

prev_version=$(cat package.json | jq -r .version)

# Running semantic-release
npx \
  -p @semantic-release/commit-analyzer \
  -p @semantic-release/release-notes-generator \
  -p @semantic-release/changelog \
  -p @semantic-release/npm \
  -p @semantic-release/git \
  -p @semantic-release/github \
  --branch master \
  --repository-url https://github.com/scostello/pfa-api \
  semantic-release

# Grab the release version from package.json
new_version=$(cat package.json | jq -r .version)

echo "Comparing package.json versions after semantic-release"
echo "${prev_version} == ${new_version}"
if [[ ${prev_version} != "${new_version}" ]]; then
  echo "New version detected. Running docker deployment..."
  docker pull quay.io/$DOCKER_USERNAME/pfa-api:build-$TRAVIS_BUILD_NUMBER
  docker tag quay.io/$DOCKER_USERNAME/pfa-api:build-$TRAVIS_BUILD_NUMBER quay.io/$DOCKER_USERNAME/pfa-api:release-${new_version}
  docker push quay.io/$DOCKER_USERNAME/pfa-api:release-${new_version}
else
  echo "No new version detected. Skipping docker deployment..."
fi
