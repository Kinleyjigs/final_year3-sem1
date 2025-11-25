(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$workos$2d$inc$2f$authkit$2d$nextjs$2f$dist$2f$esm$2f$data$3a$538eaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/node_modules/@workos-inc/authkit-nextjs/dist/esm/data:538eaf [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$workos$2d$inc$2f$authkit$2d$nextjs$2f$dist$2f$esm$2f$data$3a$ee53e6__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/node_modules/@workos-inc/authkit-nextjs/dist/esm/data:ee53e6 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$workos$2d$inc$2f$authkit$2d$nextjs$2f$dist$2f$esm$2f$data$3a$1d87b0__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/node_modules/@workos-inc/authkit-nextjs/dist/esm/data:1d87b0 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Fetch user session on mount
            async function loadUser() {
                try {
                    const response = await fetch('/api/auth/session');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.user) {
                            setUser(data.user);
                        }
                    }
                } catch (error) {
                    console.error('Failed to load user session:', error);
                } finally{
                    setLoading(false);
                }
            }
            loadUser();
        }
    }["AuthProvider.useEffect"], []);
    async function handleSignIn() {
        const signInUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$workos$2d$inc$2f$authkit$2d$nextjs$2f$dist$2f$esm$2f$data$3a$538eaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getSignInUrl"])();
        router.push(signInUrl);
    }
    async function handleSignUp() {
        const signUpUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$workos$2d$inc$2f$authkit$2d$nextjs$2f$dist$2f$esm$2f$data$3a$ee53e6__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getSignUpUrl"])();
        router.push(signUpUrl);
    }
    async function handleLogout() {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$workos$2d$inc$2f$authkit$2d$nextjs$2f$dist$2f$esm$2f$data$3a$1d87b0__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["signOut"])();
        setUser(null);
        router.push('/');
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            signIn: handleSignIn,
            signUp: handleSignUp,
            logout: handleLogout,
            isAuthenticated: !!user
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/lib/auth-context.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "J17Kp8z+0ojgAqGoY5o3BCjwWms=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
"[project]/node_modules/@workos-inc/authkit-nextjs/dist/esm/data:538eaf [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"407a5484896bc057f35cd1b93d8b95f82f37bbf7a8":"getSignInUrl"},"node_modules/@workos-inc/authkit-nextjs/dist/esm/auth.js",""] */ __turbopack_context__.s([
    "getSignInUrl",
    ()=>getSignInUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getSignInUrl = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("407a5484896bc057f35cd1b93d8b95f82f37bbf7a8", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getSignInUrl"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5pbXBvcnQgeyBkZWNvZGVKd3QgfSBmcm9tICdqb3NlJztcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoLCByZXZhbGlkYXRlVGFnIH0gZnJvbSAnbmV4dC9jYWNoZSc7XG5pbXBvcnQgeyBjb29raWVzLCBoZWFkZXJzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcbmltcG9ydCB7IHJlZGlyZWN0IH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJztcbmltcG9ydCB7IFdPUktPU19DT09LSUVfTkFNRSB9IGZyb20gJy4vZW52LXZhcmlhYmxlcy5qcyc7XG5pbXBvcnQgeyBnZXRDb29raWVPcHRpb25zIH0gZnJvbSAnLi9jb29raWUuanMnO1xuaW1wb3J0IHsgZ2V0QXV0aG9yaXphdGlvblVybCB9IGZyb20gJy4vZ2V0LWF1dGhvcml6YXRpb24tdXJsLmpzJztcbmltcG9ydCB7IGdldFNlc3Npb25Gcm9tQ29va2llLCByZWZyZXNoU2Vzc2lvbiwgd2l0aEF1dGggfSBmcm9tICcuL3Nlc3Npb24uanMnO1xuaW1wb3J0IHsgZ2V0V29ya09TIH0gZnJvbSAnLi93b3Jrb3MuanMnO1xuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIHJldmFsaWRhdGVUYWcgdG8gcHJvdmlkZSBjb21wYXRpYmlsaXR5IHdpdGggcHJldmlvdXMgdmVyc2lvbnMuXG4gKiBAcGFyYW0gdGFnIFRoZSB0YWcgdG8gcmV2YWxpZGF0ZS5cbiAqL1xuZnVuY3Rpb24gcmV2YWxpZGF0ZVRhZ0NvbXBhdCh0YWcpIHtcbiAgICBjb25zdCBmbiA9IHJldmFsaWRhdGVUYWc7XG4gICAgcmV0dXJuIGZuKHRhZywgJ21heCcpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNpZ25JblVybCh7IG9yZ2FuaXphdGlvbklkLCBsb2dpbkhpbnQsIHJlZGlyZWN0VXJpLCBwcm9tcHQsIHN0YXRlLCB9ID0ge30pIHtcbiAgICByZXR1cm4gZ2V0QXV0aG9yaXphdGlvblVybCh7IG9yZ2FuaXphdGlvbklkLCBzY3JlZW5IaW50OiAnc2lnbi1pbicsIGxvZ2luSGludCwgcmVkaXJlY3RVcmksIHByb21wdCwgc3RhdGUgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2lnblVwVXJsKHsgb3JnYW5pemF0aW9uSWQsIGxvZ2luSGludCwgcmVkaXJlY3RVcmksIHByb21wdCwgc3RhdGUsIH0gPSB7fSkge1xuICAgIHJldHVybiBnZXRBdXRob3JpemF0aW9uVXJsKHsgb3JnYW5pemF0aW9uSWQsIHNjcmVlbkhpbnQ6ICdzaWduLXVwJywgbG9naW5IaW50LCByZWRpcmVjdFVyaSwgcHJvbXB0LCBzdGF0ZSB9KTtcbn1cbi8qKlxuICogU2lnbiBvdXQgdGhlIHVzZXIgYW5kIGRlbGV0ZSB0aGUgc2Vzc2lvbiBjb29raWUuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBzaWduaW5nIG91dC5cbiAqIEBwYXJhbSBvcHRpb25zLnJldHVyblRvIFRoZSBVUkwgdG8gcmVkaXJlY3QgdG8gYWZ0ZXIgc2lnbmluZyBvdXQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWduT3V0KHsgcmV0dXJuVG8gfSA9IHt9KSB7XG4gICAgbGV0IHNlc3Npb25JZDtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHNlc3Npb25JZDogc2lkIH0gPSBhd2FpdCB3aXRoQXV0aCgpO1xuICAgICAgICBzZXNzaW9uSWQgPSBzaWQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gcmVhZGluZyBzZXNzaW9uIGRpcmVjdGx5IGZyb20gY29va2llIHdoZW4gbWlkZGxld2FyZSBpc24ndCBhdmFpbGFibGVcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb25Gcm9tQ29va2llKCk7XG4gICAgICAgIGlmIChzZXNzaW9uICYmIHNlc3Npb24uYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2lkIH0gPSBkZWNvZGVKd3Qoc2Vzc2lvbi5hY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICBzZXNzaW9uSWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYW4ndCByZWNvdmVyIC0gdGhyb3cgdGhlIG9yaWdpbmFsIGVycm9yLlxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIGNvbnN0IG5leHRDb29raWVzID0gYXdhaXQgY29va2llcygpO1xuICAgICAgICBjb25zdCBjb29raWVOYW1lID0gV09SS09TX0NPT0tJRV9OQU1FIHx8ICd3b3Mtc2Vzc2lvbic7XG4gICAgICAgIGNvbnN0IHsgZG9tYWluLCBwYXRoLCBzYW1lU2l0ZSwgc2VjdXJlIH0gPSBnZXRDb29raWVPcHRpb25zKCk7XG4gICAgICAgIG5leHRDb29raWVzLmRlbGV0ZSh7IG5hbWU6IGNvb2tpZU5hbWUsIGRvbWFpbiwgcGF0aCwgc2FtZVNpdGUsIHNlY3VyZSB9KTtcbiAgICAgICAgaWYgKHNlc3Npb25JZCkge1xuICAgICAgICAgICAgcmVkaXJlY3QoZ2V0V29ya09TKCkudXNlck1hbmFnZW1lbnQuZ2V0TG9nb3V0VXJsKHsgc2Vzc2lvbklkLCByZXR1cm5UbyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZWRpcmVjdChyZXR1cm5UbyAhPT0gbnVsbCAmJiByZXR1cm5UbyAhPT0gdm9pZCAwID8gcmV0dXJuVG8gOiAnLycpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN3aXRjaFRvT3JnYW5pemF0aW9uKG9yZ2FuaXphdGlvbklkLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyByZXR1cm5UbywgcmV2YWxpZGF0aW9uU3RyYXRlZ3kgPSAncGF0aCcsIHJldmFsaWRhdGlvblRhZ3MgPSBbXSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgY29uc3QgcGF0aG5hbWUgPSByZXR1cm5UbyB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtdXJsJykgfHwgJy8nO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHJlZnJlc2hTZXNzaW9uKHsgb3JnYW5pemF0aW9uSWQsIGVuc3VyZVNpZ25lZEluOiB0cnVlIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBlcnJvcikge1xuICAgICAgICBjb25zdCB7IGNhdXNlIH0gPSBlcnJvcjtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKChfYSA9IGNhdXNlID09PSBudWxsIHx8IGNhdXNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjYXVzZS5yYXdEYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYXV0aGtpdF9yZWRpcmVjdF91cmwpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0KGNhdXNlLnJhd0RhdGEuYXV0aGtpdF9yZWRpcmVjdF91cmwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKChjYXVzZSA9PT0gbnVsbCB8fCBjYXVzZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2F1c2UuZXJyb3IpID09PSAnc3NvX3JlcXVpcmVkJyB8fCAoY2F1c2UgPT09IG51bGwgfHwgY2F1c2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNhdXNlLmVycm9yKSA9PT0gJ21mYV9lbnJvbGxtZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGF3YWl0IGdldEF1dGhvcml6YXRpb25VcmwoeyBvcmdhbml6YXRpb25JZCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVkaXJlY3QodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN3aXRjaCAocmV2YWxpZGF0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgICByZXZhbGlkYXRlUGF0aChwYXRobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFnIG9mIHJldmFsaWRhdGlvblRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXZhbGlkYXRlVGFnQ29tcGF0KHRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHJldmFsaWRhdGlvblN0cmF0ZWd5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgcmVkaXJlY3QocGF0aG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXV0aC5qcy5tYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjhUQWtCc0IifQ==
}),
"[project]/node_modules/@workos-inc/authkit-nextjs/dist/esm/data:ee53e6 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"404bdc6b66c2564d40365d2bb2cebed249e29b8244":"getSignUpUrl"},"node_modules/@workos-inc/authkit-nextjs/dist/esm/auth.js",""] */ __turbopack_context__.s([
    "getSignUpUrl",
    ()=>getSignUpUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getSignUpUrl = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("404bdc6b66c2564d40365d2bb2cebed249e29b8244", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getSignUpUrl"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5pbXBvcnQgeyBkZWNvZGVKd3QgfSBmcm9tICdqb3NlJztcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoLCByZXZhbGlkYXRlVGFnIH0gZnJvbSAnbmV4dC9jYWNoZSc7XG5pbXBvcnQgeyBjb29raWVzLCBoZWFkZXJzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcbmltcG9ydCB7IHJlZGlyZWN0IH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJztcbmltcG9ydCB7IFdPUktPU19DT09LSUVfTkFNRSB9IGZyb20gJy4vZW52LXZhcmlhYmxlcy5qcyc7XG5pbXBvcnQgeyBnZXRDb29raWVPcHRpb25zIH0gZnJvbSAnLi9jb29raWUuanMnO1xuaW1wb3J0IHsgZ2V0QXV0aG9yaXphdGlvblVybCB9IGZyb20gJy4vZ2V0LWF1dGhvcml6YXRpb24tdXJsLmpzJztcbmltcG9ydCB7IGdldFNlc3Npb25Gcm9tQ29va2llLCByZWZyZXNoU2Vzc2lvbiwgd2l0aEF1dGggfSBmcm9tICcuL3Nlc3Npb24uanMnO1xuaW1wb3J0IHsgZ2V0V29ya09TIH0gZnJvbSAnLi93b3Jrb3MuanMnO1xuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIHJldmFsaWRhdGVUYWcgdG8gcHJvdmlkZSBjb21wYXRpYmlsaXR5IHdpdGggcHJldmlvdXMgdmVyc2lvbnMuXG4gKiBAcGFyYW0gdGFnIFRoZSB0YWcgdG8gcmV2YWxpZGF0ZS5cbiAqL1xuZnVuY3Rpb24gcmV2YWxpZGF0ZVRhZ0NvbXBhdCh0YWcpIHtcbiAgICBjb25zdCBmbiA9IHJldmFsaWRhdGVUYWc7XG4gICAgcmV0dXJuIGZuKHRhZywgJ21heCcpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNpZ25JblVybCh7IG9yZ2FuaXphdGlvbklkLCBsb2dpbkhpbnQsIHJlZGlyZWN0VXJpLCBwcm9tcHQsIHN0YXRlLCB9ID0ge30pIHtcbiAgICByZXR1cm4gZ2V0QXV0aG9yaXphdGlvblVybCh7IG9yZ2FuaXphdGlvbklkLCBzY3JlZW5IaW50OiAnc2lnbi1pbicsIGxvZ2luSGludCwgcmVkaXJlY3RVcmksIHByb21wdCwgc3RhdGUgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2lnblVwVXJsKHsgb3JnYW5pemF0aW9uSWQsIGxvZ2luSGludCwgcmVkaXJlY3RVcmksIHByb21wdCwgc3RhdGUsIH0gPSB7fSkge1xuICAgIHJldHVybiBnZXRBdXRob3JpemF0aW9uVXJsKHsgb3JnYW5pemF0aW9uSWQsIHNjcmVlbkhpbnQ6ICdzaWduLXVwJywgbG9naW5IaW50LCByZWRpcmVjdFVyaSwgcHJvbXB0LCBzdGF0ZSB9KTtcbn1cbi8qKlxuICogU2lnbiBvdXQgdGhlIHVzZXIgYW5kIGRlbGV0ZSB0aGUgc2Vzc2lvbiBjb29raWUuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBzaWduaW5nIG91dC5cbiAqIEBwYXJhbSBvcHRpb25zLnJldHVyblRvIFRoZSBVUkwgdG8gcmVkaXJlY3QgdG8gYWZ0ZXIgc2lnbmluZyBvdXQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWduT3V0KHsgcmV0dXJuVG8gfSA9IHt9KSB7XG4gICAgbGV0IHNlc3Npb25JZDtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHNlc3Npb25JZDogc2lkIH0gPSBhd2FpdCB3aXRoQXV0aCgpO1xuICAgICAgICBzZXNzaW9uSWQgPSBzaWQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gcmVhZGluZyBzZXNzaW9uIGRpcmVjdGx5IGZyb20gY29va2llIHdoZW4gbWlkZGxld2FyZSBpc24ndCBhdmFpbGFibGVcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb25Gcm9tQ29va2llKCk7XG4gICAgICAgIGlmIChzZXNzaW9uICYmIHNlc3Npb24uYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2lkIH0gPSBkZWNvZGVKd3Qoc2Vzc2lvbi5hY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICBzZXNzaW9uSWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYW4ndCByZWNvdmVyIC0gdGhyb3cgdGhlIG9yaWdpbmFsIGVycm9yLlxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIGNvbnN0IG5leHRDb29raWVzID0gYXdhaXQgY29va2llcygpO1xuICAgICAgICBjb25zdCBjb29raWVOYW1lID0gV09SS09TX0NPT0tJRV9OQU1FIHx8ICd3b3Mtc2Vzc2lvbic7XG4gICAgICAgIGNvbnN0IHsgZG9tYWluLCBwYXRoLCBzYW1lU2l0ZSwgc2VjdXJlIH0gPSBnZXRDb29raWVPcHRpb25zKCk7XG4gICAgICAgIG5leHRDb29raWVzLmRlbGV0ZSh7IG5hbWU6IGNvb2tpZU5hbWUsIGRvbWFpbiwgcGF0aCwgc2FtZVNpdGUsIHNlY3VyZSB9KTtcbiAgICAgICAgaWYgKHNlc3Npb25JZCkge1xuICAgICAgICAgICAgcmVkaXJlY3QoZ2V0V29ya09TKCkudXNlck1hbmFnZW1lbnQuZ2V0TG9nb3V0VXJsKHsgc2Vzc2lvbklkLCByZXR1cm5UbyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZWRpcmVjdChyZXR1cm5UbyAhPT0gbnVsbCAmJiByZXR1cm5UbyAhPT0gdm9pZCAwID8gcmV0dXJuVG8gOiAnLycpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN3aXRjaFRvT3JnYW5pemF0aW9uKG9yZ2FuaXphdGlvbklkLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyByZXR1cm5UbywgcmV2YWxpZGF0aW9uU3RyYXRlZ3kgPSAncGF0aCcsIHJldmFsaWRhdGlvblRhZ3MgPSBbXSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgY29uc3QgcGF0aG5hbWUgPSByZXR1cm5UbyB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtdXJsJykgfHwgJy8nO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHJlZnJlc2hTZXNzaW9uKHsgb3JnYW5pemF0aW9uSWQsIGVuc3VyZVNpZ25lZEluOiB0cnVlIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBlcnJvcikge1xuICAgICAgICBjb25zdCB7IGNhdXNlIH0gPSBlcnJvcjtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKChfYSA9IGNhdXNlID09PSBudWxsIHx8IGNhdXNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjYXVzZS5yYXdEYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYXV0aGtpdF9yZWRpcmVjdF91cmwpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0KGNhdXNlLnJhd0RhdGEuYXV0aGtpdF9yZWRpcmVjdF91cmwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKChjYXVzZSA9PT0gbnVsbCB8fCBjYXVzZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2F1c2UuZXJyb3IpID09PSAnc3NvX3JlcXVpcmVkJyB8fCAoY2F1c2UgPT09IG51bGwgfHwgY2F1c2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNhdXNlLmVycm9yKSA9PT0gJ21mYV9lbnJvbGxtZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGF3YWl0IGdldEF1dGhvcml6YXRpb25VcmwoeyBvcmdhbml6YXRpb25JZCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVkaXJlY3QodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN3aXRjaCAocmV2YWxpZGF0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgICByZXZhbGlkYXRlUGF0aChwYXRobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFnIG9mIHJldmFsaWRhdGlvblRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXZhbGlkYXRlVGFnQ29tcGF0KHRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHJldmFsaWRhdGlvblN0cmF0ZWd5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgcmVkaXJlY3QocGF0aG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXV0aC5qcy5tYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjhUQXFCc0IifQ==
}),
"[project]/node_modules/@workos-inc/authkit-nextjs/dist/esm/data:1d87b0 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403766a113ab8bb3a0a32a67428e14175e440a50a1":"signOut"},"node_modules/@workos-inc/authkit-nextjs/dist/esm/auth.js",""] */ __turbopack_context__.s([
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var signOut = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("403766a113ab8bb3a0a32a67428e14175e440a50a1", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "signOut"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5pbXBvcnQgeyBkZWNvZGVKd3QgfSBmcm9tICdqb3NlJztcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoLCByZXZhbGlkYXRlVGFnIH0gZnJvbSAnbmV4dC9jYWNoZSc7XG5pbXBvcnQgeyBjb29raWVzLCBoZWFkZXJzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcbmltcG9ydCB7IHJlZGlyZWN0IH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJztcbmltcG9ydCB7IFdPUktPU19DT09LSUVfTkFNRSB9IGZyb20gJy4vZW52LXZhcmlhYmxlcy5qcyc7XG5pbXBvcnQgeyBnZXRDb29raWVPcHRpb25zIH0gZnJvbSAnLi9jb29raWUuanMnO1xuaW1wb3J0IHsgZ2V0QXV0aG9yaXphdGlvblVybCB9IGZyb20gJy4vZ2V0LWF1dGhvcml6YXRpb24tdXJsLmpzJztcbmltcG9ydCB7IGdldFNlc3Npb25Gcm9tQ29va2llLCByZWZyZXNoU2Vzc2lvbiwgd2l0aEF1dGggfSBmcm9tICcuL3Nlc3Npb24uanMnO1xuaW1wb3J0IHsgZ2V0V29ya09TIH0gZnJvbSAnLi93b3Jrb3MuanMnO1xuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIHJldmFsaWRhdGVUYWcgdG8gcHJvdmlkZSBjb21wYXRpYmlsaXR5IHdpdGggcHJldmlvdXMgdmVyc2lvbnMuXG4gKiBAcGFyYW0gdGFnIFRoZSB0YWcgdG8gcmV2YWxpZGF0ZS5cbiAqL1xuZnVuY3Rpb24gcmV2YWxpZGF0ZVRhZ0NvbXBhdCh0YWcpIHtcbiAgICBjb25zdCBmbiA9IHJldmFsaWRhdGVUYWc7XG4gICAgcmV0dXJuIGZuKHRhZywgJ21heCcpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNpZ25JblVybCh7IG9yZ2FuaXphdGlvbklkLCBsb2dpbkhpbnQsIHJlZGlyZWN0VXJpLCBwcm9tcHQsIHN0YXRlLCB9ID0ge30pIHtcbiAgICByZXR1cm4gZ2V0QXV0aG9yaXphdGlvblVybCh7IG9yZ2FuaXphdGlvbklkLCBzY3JlZW5IaW50OiAnc2lnbi1pbicsIGxvZ2luSGludCwgcmVkaXJlY3RVcmksIHByb21wdCwgc3RhdGUgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2lnblVwVXJsKHsgb3JnYW5pemF0aW9uSWQsIGxvZ2luSGludCwgcmVkaXJlY3RVcmksIHByb21wdCwgc3RhdGUsIH0gPSB7fSkge1xuICAgIHJldHVybiBnZXRBdXRob3JpemF0aW9uVXJsKHsgb3JnYW5pemF0aW9uSWQsIHNjcmVlbkhpbnQ6ICdzaWduLXVwJywgbG9naW5IaW50LCByZWRpcmVjdFVyaSwgcHJvbXB0LCBzdGF0ZSB9KTtcbn1cbi8qKlxuICogU2lnbiBvdXQgdGhlIHVzZXIgYW5kIGRlbGV0ZSB0aGUgc2Vzc2lvbiBjb29raWUuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBzaWduaW5nIG91dC5cbiAqIEBwYXJhbSBvcHRpb25zLnJldHVyblRvIFRoZSBVUkwgdG8gcmVkaXJlY3QgdG8gYWZ0ZXIgc2lnbmluZyBvdXQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWduT3V0KHsgcmV0dXJuVG8gfSA9IHt9KSB7XG4gICAgbGV0IHNlc3Npb25JZDtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHNlc3Npb25JZDogc2lkIH0gPSBhd2FpdCB3aXRoQXV0aCgpO1xuICAgICAgICBzZXNzaW9uSWQgPSBzaWQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gcmVhZGluZyBzZXNzaW9uIGRpcmVjdGx5IGZyb20gY29va2llIHdoZW4gbWlkZGxld2FyZSBpc24ndCBhdmFpbGFibGVcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb25Gcm9tQ29va2llKCk7XG4gICAgICAgIGlmIChzZXNzaW9uICYmIHNlc3Npb24uYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2lkIH0gPSBkZWNvZGVKd3Qoc2Vzc2lvbi5hY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICBzZXNzaW9uSWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYW4ndCByZWNvdmVyIC0gdGhyb3cgdGhlIG9yaWdpbmFsIGVycm9yLlxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIGNvbnN0IG5leHRDb29raWVzID0gYXdhaXQgY29va2llcygpO1xuICAgICAgICBjb25zdCBjb29raWVOYW1lID0gV09SS09TX0NPT0tJRV9OQU1FIHx8ICd3b3Mtc2Vzc2lvbic7XG4gICAgICAgIGNvbnN0IHsgZG9tYWluLCBwYXRoLCBzYW1lU2l0ZSwgc2VjdXJlIH0gPSBnZXRDb29raWVPcHRpb25zKCk7XG4gICAgICAgIG5leHRDb29raWVzLmRlbGV0ZSh7IG5hbWU6IGNvb2tpZU5hbWUsIGRvbWFpbiwgcGF0aCwgc2FtZVNpdGUsIHNlY3VyZSB9KTtcbiAgICAgICAgaWYgKHNlc3Npb25JZCkge1xuICAgICAgICAgICAgcmVkaXJlY3QoZ2V0V29ya09TKCkudXNlck1hbmFnZW1lbnQuZ2V0TG9nb3V0VXJsKHsgc2Vzc2lvbklkLCByZXR1cm5UbyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZWRpcmVjdChyZXR1cm5UbyAhPT0gbnVsbCAmJiByZXR1cm5UbyAhPT0gdm9pZCAwID8gcmV0dXJuVG8gOiAnLycpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN3aXRjaFRvT3JnYW5pemF0aW9uKG9yZ2FuaXphdGlvbklkLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyByZXR1cm5UbywgcmV2YWxpZGF0aW9uU3RyYXRlZ3kgPSAncGF0aCcsIHJldmFsaWRhdGlvblRhZ3MgPSBbXSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgY29uc3QgcGF0aG5hbWUgPSByZXR1cm5UbyB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtdXJsJykgfHwgJy8nO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHJlZnJlc2hTZXNzaW9uKHsgb3JnYW5pemF0aW9uSWQsIGVuc3VyZVNpZ25lZEluOiB0cnVlIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBlcnJvcikge1xuICAgICAgICBjb25zdCB7IGNhdXNlIH0gPSBlcnJvcjtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKChfYSA9IGNhdXNlID09PSBudWxsIHx8IGNhdXNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjYXVzZS5yYXdEYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYXV0aGtpdF9yZWRpcmVjdF91cmwpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0KGNhdXNlLnJhd0RhdGEuYXV0aGtpdF9yZWRpcmVjdF91cmwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKChjYXVzZSA9PT0gbnVsbCB8fCBjYXVzZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2F1c2UuZXJyb3IpID09PSAnc3NvX3JlcXVpcmVkJyB8fCAoY2F1c2UgPT09IG51bGwgfHwgY2F1c2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNhdXNlLmVycm9yKSA9PT0gJ21mYV9lbnJvbGxtZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGF3YWl0IGdldEF1dGhvcml6YXRpb25VcmwoeyBvcmdhbml6YXRpb25JZCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVkaXJlY3QodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN3aXRjaCAocmV2YWxpZGF0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgICByZXZhbGlkYXRlUGF0aChwYXRobmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFnIG9mIHJldmFsaWRhdGlvblRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXZhbGlkYXRlVGFnQ29tcGF0KHRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHJldmFsaWRhdGlvblN0cmF0ZWd5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgcmVkaXJlY3QocGF0aG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXV0aC5qcy5tYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlUQTZCc0IifQ==
}),
]);

//# sourceMappingURL=_ce1b69ca._.js.map