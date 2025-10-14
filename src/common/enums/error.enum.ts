export const ErrorList = {
	GeneralBadRequest: { code: "URL/BADREQUEST", message: "business/Branch not found" },

	ParamsCategoryIdNotDefined: { code: "PARAMS/CATEGORYIDNOTDEFINED", message: "Category id is not defined" },
	ParamsSubCategoryIdNotDefined: { code: "PARAMS/SUBCATEGORYIDNOTDEFINED", message: "Subcategory id is not defined" },
	SubcategoryWithoutCategory: { code: "SUBCATEGORY/WITHOUTCATEGORY", message: "Subcategory without category" },

	ValidatorError: { code: "SYSTEM/VALIDATOR", message: "ClassValidator error, check json" },
	InternalError: { code: "SYSTEM/INTERNALERROR", message: "Internal server error" },

	UserNotFound: { code: "USER/NOTFOUND", message: "User not found" },
	UserAlreadyExist: { code: "USER/ALREADYEXIST", message: "User already exist" },
	UserCreateAccountUnauthorized: { code: "USER/PROHIBITED", message: "Only owner can create subaccount" },
	UserBusinessNameEmpty: { code: "USER/BUSINESSNAMEEMPTY", message: "business_name is required" },

	ProductNotFound: { code: "PRODUCT/NOTFOUND", message: "Product not found" },
	ProductAlreadyExist: { code: "PRODUCT/ALREADYEXIST", message: "Product already exist" },
	ProductNotActive: { code: "PRODUCT/NOTACTIVE", message: "Product not active" },
	ProductFilterArrayPriceRangeLength: { code: "PRODUCT/FILTERPRICERANGELENGTH", message: "Array priceRange range must be 2" },

	OrderNotFound: { code: "ORDER/NOTFOUND", message: "Order not found" },
	OrderInitError: { code: "ORDER/INITERROR", message: "Order init error" },
	OrderBadRequest: { code: "ORDER/BADREQUEST", message: "Order bad request" },
	OrderProductNotFound: { code: "ORDERPRODUCT/NOTFOUND", message: "OrderProduct not found" },

	TableNotFound: { code: "TABLE/NOTFOUND", message: "Table not found" },

	MenuNotFound: { code: "MENU/NOTFOUND", message: "Menu not found" },
	MenuIdRequired: { code: "MENU/IDNOTSPECIFIED", message: "Menu ID is required" },

	CategoryNotFound: { code: "CATEGORY/NOTFOUND", message: "Category not found" },
	CategoryAlreadyExist: { code: "CATEGORY/ALREADYEXIST", message: "Category already exist" },
	CategoryProductAlreadyExist: { code: "CATEGORY/PRODUCTALREADYEXIST", message: "Product already exist" },
	CategoryProductNotFound: { code: "CATEGORY/PRODUCTNOTFOUND", message: "Product not found" },
	CategoryIDNotSpecified: { code: "CATEGORY/IDNOTSPECIFIED", message: "Category ID is required" },

	SubcategoryNotFound: { code: "SUBCATEGORY/NOTFOUND", message: "Subcategory not found" },
	SubcategoryAttachDisabled: { code: "SUBCATEGORY/ATTACHERROR", message: "Category has attachmentt disabled" },
	SubcategoryProductAlreadyExist: { code: "SUBCATEGORY/PRODUCTALREADYEXIST", message: "Product already exist" },
	SubcategoryProductNotFound: { code: "SUBCATEGORY/PRODUCTNOTFOUND", message: "Product not found" },

	AuthUserNotFound: { code: "AUTH/USERNOTFOUND", message: "User not found" },
	AuthInvalid: { code: "AUTH/INVALID", message: "Invalid username or password" },
	AuthInvalidPassword: { code: "AUTH/INVALIDPASS", message: "Invalid password" },
	AuthUnauthorized: { code: "AUTH/UNAUTHORIZED", message: "Unauthorized: refresh token" },
	AuthUnauthorizedRole: { code: "AUTH/ROLEDENIED", message: "Unauthorized: insufficient role permission" },
	AuthUnauthorizedPermission: { code: "AUTH/PERMISSIONDENIED", message: "Unauthorized: insufficient permission" },
	AuthVerificatonTokenError: { code: "AUTH/TOKENERROR", message: "Invalid verification token" },
	AuthInvitationToken: { code: "AUTH/INVITATIONTOKEN", message: "Invitation token is only to registry new users" },
	AuthInvalidPasswordNotEqual: { code: "AUTH/PASSWORDNOTEQUAL", message: "Old password and new, are not equals" },

	UploadImageNotSpecified: { code: "UPLOAD/NOTSPECIFIED", message: "No image specified" },
	UploadError: { code: "UPLOAD/ERROR", message: "Error uploading image to drive" },
	UploadUrlGenerateError: { code: "UPLOAD/SIGNEDURL", message: "Error creating signed URL" },
	UploadImageNotSupported: { code: "UPLOAD/IMAGENOTSUPPORTED", message: "Image not supported" },
	UploadCsvEmpty: { code: "UPLOAD/CSVEMPTY", message: "CSV file is not specified" },
	UploadCsvError: { code: "UPLOAD/CSVERROR", message: "Error uploading CSV file" },

	PromotionBadRequest: { code: "PROMOTIONS/BADREQUEST", message: "Bad request" },
	PromotionNotFound: { code: "PROMOTIONS/NOTFOUND", message: "Promotion not found" },

	SummaryBadRequest: { code: "SUMMARY/BADREQUESTDATE", message: "Bad request" },

	TokenNotProvided: { code: "TOKEN/NOTPROVIDED", message: "No token" },
	TokenInvalid: { code: "TOKEN/INVALIDTOKEN", message: "Bad token" },
	TokenExpired: { code: "TOKEN/EXPIRED", message: "Token expired" },

	TokenRefreshError: { code: "TOKEN/REFRESHINVALIDATED", message: "Token refresh is old or already used" },

	SubscriptionNotFound: { code: "SUBSCRIPTION/NOTFOUND", message: "Subscription not found" },
	SubscriptionMaxUsersReached: { code: "SUBSCRIPTION/MAXUSERSREACHED", message: "Max users reached" },
	SubscriptionMaxBranchesReached: { code: "SUBSCRIPTION/MAXBRANCHESREACHED", message: "Max branches reached" },
	SubscriptionMaxBusinessReached: { code: "SUBSCRIPTION/MAXBUSINESSREACHED", message: "Max businesses reached" },
	SubscriptionMaxMenusReached: { code: "SUBSCRIPTION/MAXMENUSREACHED", message: "Max menus reached" },
	SubscriptionMaxProductsReached: { code: "SUBSCRIPTION/MAXPRODUCTSREACHED", message: "Max products reached" },
	SubscriptionMaxCategoriesReached: { code: "SUBSCRIPTION/MAXCATEGORIESREACHED", message: "Max categories reached" },
	SubscriptionMaxSubcategoriesReached: { code: "SUBSCRIPTION/MAXSUBCATEGORIESREACHED", message: "Max subcategories reached" },
	SubscriptionLinkitNotAllowed: { code: "SUBSCRIPTION/LINKITNOTALLOWED", message: "Linkit creation not allowed" },

	BranchNotFound: { code: "BRANCH/NOTFOUND", message: "Branch not found" },
	BranchCreationError: { code: "BRANCH/CREATIONERROR", message: "Error creating branch" },
	BranchAlreadyExist: { code: "BRANCH/ALREADYEXIST", message: "Branch already exist" },
	BranchBadBusiness: { code: "BRANCH/BADBUSINESS", message: "Branch not exists in current business" },
	BranchDuplicatedSlug: { code: "BRANCH/SLUGDUPLICATE", message: "Branch slug duplicated" },

	Deprecated: { code: "SYSTEM/DEPRECATED", message: "This function is deprecated" },

	BusinessCreationError: { code: "business/SERVERERROR", message: "Internal error on creation" },
	BusinessNotFound: { code: "business/NOTFOUND", message: "business not found" },
	BusinessUserNotFound: { code: "business/USERNOTFOUND", message: "User not found in business" },

	EmailInvalid: { code: "EMAIL/NOTEXISTS", message: "Email provided not exists" },

	WebScoketInvalid: { code: "WEBSOCKET/EVENTNAMEERROR", message: "Eventname not exists" },

	PaletteNotFount: { code: "COLOR/NOTFOUND", message: "Palette not found" },

	MemberRoleForbidden: {
		code: "MEMBERS/ACTIONFORBIDDEN",
		message: "Cannot apply role due you have not sufficient levelYou cannot apply for the role because you do not have the sufficient level",
	},
	MemberNotFound: { code: "MEMBERS/NOTFOUND", message: "branchMember not found" },

	ScheduleNotFound: { code: "SCHEDULE/NOTFOUND", message: "Schedule not found" },

	SharedPaletteNotFound: { code: "SHAREDCOLOR/NOTFOUND", message: "Shared color not found" },

	PermissionCreationError: { code: "PERMISSION/CREATIONERROR", message: "Error creating permission" },
	PermissionNotFound: { code: "PERMISSION/NOTFOUND", message: "Permission not found" },
	PermissionAlreadyExist: { code: "PERMISSION/ALREADYEXIST", message: "Permission already exist" },
	PermissionUpdateError: { code: "PERMISSION/UPDATEERROR", message: "Error updating permission" },
	PermissionDeleteError: { code: "PERMISSION/DELETEERROR", message: "Error deleting permission" },
	PermissionOnlyOneParameterAllowed: {
		code: "PERMISSION/BADPARAMETERS",
		message: "Only one parameter is allowed in this endopint. branchMemberId or businessOwnerId",
	},
	PermissionOneParameterRequired: { code: "PERMISSION/BADPARAMETERS", message: "branchMemberId or businessOwnerId must to be a non null value" },

	RoleNotFound: { code: "ROLE/NOTFOUND", message: "Role not found" },

	LinkitCreationError: { code: "LINKIT/CREATIONERROR", message: "Error creating linkit" },
	LinkitNotFound: { code: "LINKIT/NOTFOUND", message: "Linkit not found" },
	LinkitAlreadyExist: { code: "LINKIT/ALREADYEXIST", message: "Linkit already exists" },

	PromotionDayBusy: { code: "PROMOTION/DAYBUSY", message: "Promotion day is busy" },

	PlanNotFound: { code: "PLAN/NOTFOUND", message: "Plan not found" },
} as const;

export type ErrorType = keyof typeof ErrorList;
