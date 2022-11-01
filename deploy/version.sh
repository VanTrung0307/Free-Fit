
# Determine the version
package_json_version=$(cat ./package.json | jq '.version' | tr -d '"')
export BUILD_VERSION=${package_json_version}
export IMAGE_TAG="${BUILD_VERSION}"

printenv
