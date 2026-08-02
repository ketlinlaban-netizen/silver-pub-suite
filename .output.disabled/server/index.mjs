globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-07-29T21:36:44.785Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/BarChart-DvDM4u-W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a5ba-9A1GK/LaDwJYK3G1aZZ0AUZLatM\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 370106,
		"path": "../public/assets/BarChart-DvDM4u-W.js"
	},
	"/assets/Receipt-DpOBtY-n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e86-KfYzkVHDkduVT+0aILmNCxf9GoM\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 3718,
		"path": "../public/assets/Receipt-DpOBtY-n.js"
	},
	"/assets/audit-BdgqHKEb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ad-AjTp5fAUf+9WhL4D3suTd3pRqq4\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 2221,
		"path": "../public/assets/audit-BdgqHKEb.js"
	},
	"/assets/auth-CXMyrKUS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"895c-M63SeG7H6NOvPvDxxpArcwY94tc\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 35164,
		"path": "../public/assets/auth-CXMyrKUS.js"
	},
	"/assets/beer-DOos3m-K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d3-YL38qxH6bYxXnOw2MwMN452fcGA\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 467,
		"path": "../public/assets/beer-DOos3m-K.js"
	},
	"/assets/boxes-D7bom2-D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"353-EffRP5y49ypo6BqHX++O9lCEu6k\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 851,
		"path": "../public/assets/boxes-D7bom2-D.js"
	},
	"/assets/button-Doj9sf_5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1241-wXPQ8tgTs2KlHxdJ93H360KdDo8\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 4673,
		"path": "../public/assets/button-Doj9sf_5.js"
	},
	"/assets/categories-CrvtzTHx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec6-4K5tyO/Z92FDy9Js5KyUgmFBXEw\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 3782,
		"path": "../public/assets/categories-CrvtzTHx.js"
	},
	"/assets/chart-column-5y3jRbbU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-kr6kC3OwiI+PjW5zIIHqO9jJB1M\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 251,
		"path": "../public/assets/chart-column-5y3jRbbU.js"
	},
	"/assets/client-Bu5O_hIf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"354a7-QjUaAFPc1dc6pMOtr6nQ3Y3SyBY\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 218279,
		"path": "../public/assets/client-Bu5O_hIf.js"
	},
	"/assets/clipboard-list-Bn39wFiI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19b-Lums8pT4Ld4weggxO8WGpNkyDKY\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 411,
		"path": "../public/assets/clipboard-list-Bn39wFiI.js"
	},
	"/assets/clock-3-B6q6q3oW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-GAaeSQUFsUNeRYDOb97Bl2LnLbg\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 169,
		"path": "../public/assets/clock-3-B6q6q3oW.js"
	},
	"/assets/createLucideIcon-BybetNPI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a6-cKxC91hjcckQcnx5wc6WXfKkN0w\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 1190,
		"path": "../public/assets/createLucideIcon-BybetNPI.js"
	},
	"/assets/customers-BcXF85Oe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13cc-FzvUijX6k6UeC1L1iUAjgW5RZ1A\"",
		"mtime": "2026-07-29T21:36:43.182Z",
		"size": 5068,
		"path": "../public/assets/customers-BcXF85Oe.js"
	},
	"/assets/dashboard-0tKA2g-_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b888-9ucYAazSb6B9YOyr3G9gM/jjtJg\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 47240,
		"path": "../public/assets/dashboard-0tKA2g-_.js"
	},
	"/assets/dialog-BvrmsKcF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a3b-4ihD80SRRzxKbe30Xu32y8TuMIE\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 6715,
		"path": "../public/assets/dialog-BvrmsKcF.js"
	},
	"/assets/dispensing-DPsmaKC2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156d-TBWMzZx7pZa24xbI77dH5MV1Dn0\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 5485,
		"path": "../public/assets/dispensing-DPsmaKC2.js"
	},
	"/assets/es2015-D_9emQRR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"723e-0flvU8gaFGugBnzrC+sCwNVRcN8\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 29246,
		"path": "../public/assets/es2015-D_9emQRR.js"
	},
	"/assets/expenses-DtvY-Xrf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1466-9PUWFFfEe6OWiktlLeSOVSQc35c\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 5222,
		"path": "../public/assets/expenses-DtvY-Xrf.js"
	},
	"/assets/format-CVAXJSZ7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b0-5/U8YuBAvLIiT5IkF9JKD4fqrno\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 944,
		"path": "../public/assets/format-CVAXJSZ7.js"
	},
	"/assets/index-qTIT9x1A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6af69-yEPL/oAK9Wy9EEJXJoqzaUVHtTc\"",
		"mtime": "2026-07-29T21:36:43.178Z",
		"size": 438121,
		"path": "../public/assets/index-qTIT9x1A.js"
	},
	"/assets/input-yeWvbTI2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-iSIshcimJRBy1p4UUbVAOYPNza8\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 616,
		"path": "../public/assets/input-yeWvbTI2.js"
	},
	"/assets/inventory-CLyWPMtI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1406-Xytv51gRYGYP9u8uQPapzS8zmeY\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 5126,
		"path": "../public/assets/inventory-CLyWPMtI.js"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"a2937-NnybOIqkfJG0Drs4VbkqS+b9Xj8\"",
		"mtime": "2026-07-29T21:36:44.786Z",
		"size": 665911,
		"path": "../public/favicon.png"
	},
	"/assets/label-BrpU-iZv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f1-IrkMt2IcsnVcUlJWRDqKFGFt0Yg\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 1265,
		"path": "../public/assets/label-BrpU-iZv.js"
	},
	"/assets/lock-DcobhfrM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-Sqtz/KQi1w19/sL8Vff+VGoi30Y\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 206,
		"path": "../public/assets/lock-DcobhfrM.js"
	},
	"/assets/plus-DeiawL56.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-YJhwnSqLuH2k/cuC5uS8ZLmEyHA\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 153,
		"path": "../public/assets/plus-DeiawL56.js"
	},
	"/assets/pos-B_3K-YBc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c1e-0zJMOsH73CgvAwVufTQtYwcI2zg\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 3102,
		"path": "../public/assets/pos-B_3K-YBc.js"
	},
	"/assets/pos-Caxeik-2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51d9-p2yzccnJ4J6UWwPEh+D/o44+Shk\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 20953,
		"path": "../public/assets/pos-Caxeik-2.js"
	},
	"/assets/premium-8OsoTJ9k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86b-DqbONJHnl6/AqUq/sCVkYxhIdGg\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 2155,
		"path": "../public/assets/premium-8OsoTJ9k.js"
	},
	"/assets/printer-Bo6ClC3W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-xrrKAurBBdc+OMRto2u/1i+ZeyE\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 319,
		"path": "../public/assets/printer-Bo6ClC3W.js"
	},
	"/assets/products-DcusDLZl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d4b-5HzLq0fva9nY/58W2o3Na3Nqvfs\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 11595,
		"path": "../public/assets/products-DcusDLZl.js"
	},
	"/assets/purchases-Br7I4caS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"180d-Ha47sksGn25TjuTzqRxL07fPVrk\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 6157,
		"path": "../public/assets/purchases-Br7I4caS.js"
	},
	"/assets/proxy-8d8MJa7T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d88d-EhNJueSlOJVQMngarm13LHyvy4c\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 120973,
		"path": "../public/assets/proxy-8d8MJa7T.js"
	},
	"/assets/react-dom-CsjTPwWC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd5-GnYLU0GbhbGHNxL9fhG6h5x4jMg\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 3541,
		"path": "../public/assets/react-dom-CsjTPwWC.js"
	},
	"/assets/receipt-text-3ugL1tgq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"297-5hDW5WhjoV+0GVDgxLd6JC6C3lo\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 663,
		"path": "../public/assets/receipt-text-3ugL1tgq.js"
	},
	"/assets/reports-B8egLEMq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40da-90qO/VmaVPItZrukSscB7Hobp4k\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 16602,
		"path": "../public/assets/reports-B8egLEMq.js"
	},
	"/assets/route-BaYoA4SZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dd1-cluAUa5EjZvrSRGHRsweztIQAOo\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 7633,
		"path": "../public/assets/route-BaYoA4SZ.js"
	},
	"/assets/routes-rFW3liWu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c0-IOjwqmxVbEMcJgra4+r+6MmHsdM\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 960,
		"path": "../public/assets/routes-rFW3liWu.js"
	},
	"/assets/search-COit5Xhw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-Q5reG62ZdQZN+AKA7JCZWIm6ZDo\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 174,
		"path": "../public/assets/search-COit5Xhw.js"
	},
	"/assets/select-Uv1MLM3O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d984-XEh1WmxOSFrksCE6lP9wJatpX7w\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 55684,
		"path": "../public/assets/select-Uv1MLM3O.js"
	},
	"/assets/settings-BZHIrOxI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f42-MHUlUqjSh8mCEgaIuu4TKTTAbfw\"",
		"mtime": "2026-07-29T21:36:43.183Z",
		"size": 3906,
		"path": "../public/assets/settings-BZHIrOxI.js"
	},
	"/assets/shifts-DbQo_yWT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28d0-mY1jxIIXbWKAJ8ndZAmNZ6Zb7DU\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 10448,
		"path": "../public/assets/shifts-DbQo_yWT.js"
	},
	"/assets/skeleton-BFPdLkfM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24e-zq8yu95dwP0TxZf8aC7dzr2y1B8\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 590,
		"path": "../public/assets/skeleton-BFPdLkfM.js"
	},
	"/assets/staff-Bm-XerZE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8c-2YjuqQheBQaR1ypD7mgm91HcOdA\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 2700,
		"path": "../public/assets/staff-Bm-XerZE.js"
	},
	"/assets/star-BMC2F6HJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-RuHFMHeCWY+K53FmkqNTXtC6YUA\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 472,
		"path": "../public/assets/star-BMC2F6HJ.js"
	},
	"/assets/styles-OzUkQCkg.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"153bf-EO4SCp8ILCUQOwTMYd61Sx7EHhM\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 86975,
		"path": "../public/assets/styles-OzUkQCkg.css"
	},
	"/assets/suppliers-CZmDfFx7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a9-kJnSm7r+dpS9JYCK292yKjq00RA\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 4265,
		"path": "../public/assets/suppliers-CZmDfFx7.js"
	},
	"/assets/tabs-C-jK3FUD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b59-SVYnSIzr1z3rOyCEQDA3ffOrHhY\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 15193,
		"path": "../public/assets/tabs-C-jK3FUD.js"
	},
	"/assets/textarea-BktZvqi-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"202-hz+9WF+7xEieAPxjnosVBD/DcNo\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 514,
		"path": "../public/assets/textarea-BktZvqi-.js"
	},
	"/assets/trash-2-CxS-gTsS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-2CKeobNXEIwmI8zP/EfpkFmBL4c\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 328,
		"path": "../public/assets/trash-2-CxS-gTsS.js"
	},
	"/assets/triangle-alert-CT55g0_m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-DVH1aY1GfvdoMMGwzDp0S/M9vEw\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-CT55g0_m.js"
	},
	"/assets/truck-0AdMnJ8O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-tUC6ynGB3J7LNFqLJhm1AWtHZHk\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 406,
		"path": "../public/assets/truck-0AdMnJ8O.js"
	},
	"/assets/useQuery-oOltWjT6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2256-0O4Le8uheMXGpelfQcPgcMCWWo8\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 8790,
		"path": "../public/assets/useQuery-oOltWjT6.js"
	},
	"/assets/useShift-b4EjO5_R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-Fpu0AqXN1AdkFcnpiv96cjNOBUc\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 424,
		"path": "../public/assets/useShift-b4EjO5_R.js"
	},
	"/assets/user-cog-BreiKDzp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"285-tv12iZo0GBfTHW4ynCEVKrjp+uw\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 645,
		"path": "../public/assets/user-cog-BreiKDzp.js"
	},
	"/assets/users-DhOA_dq8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-FvOSBAByTE2/5bGS08XvKHhqC1M\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 306,
		"path": "../public/assets/users-DhOA_dq8.js"
	},
	"/assets/utils-B6KiDbIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7d-iNkBSvaSyIjvZOzWoTvEa49qwcI\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 27261,
		"path": "../public/assets/utils-B6KiDbIe.js"
	},
	"/assets/wallet-Do2A8uQp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e-wYpKTm/VC8Sp9X1OuyKCDVD7SN4\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 286,
		"path": "../public/assets/wallet-Do2A8uQp.js"
	},
	"/assets/x-Dbwc5DZM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-A+VR4p6aNa+bHUd7XRtgER5+Zdk\"",
		"mtime": "2026-07-29T21:36:43.184Z",
		"size": 154,
		"path": "../public/assets/x-Dbwc5DZM.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_vPsSQd = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_vPsSQd
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
