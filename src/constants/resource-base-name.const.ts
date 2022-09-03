// this concatenated name will be used as the name, display name, or prefix for resources

import APPLICATION_NAME from "./application-name.const";
import NAMESPACE from "./namespace.const";

export const RESOURCE_BASE_NAME: string = `${NAMESPACE}-${APPLICATION_NAME}`;