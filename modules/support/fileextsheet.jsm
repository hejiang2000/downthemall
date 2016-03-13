/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is DownThemAll FileExtensionSheet (CSS) module.
 *
 * The Initial Developer of the Original Code is Nils Maier
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Nils Maier <MaierMan@web.de>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var EXPORTED_SYMBOLS = ['FileExtensionSheet'];

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cr = Components.results;
var Cu = Components.utils;
var Exception = Components.Exception;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://dta/utils.jsm");
Cu.import("resource://dta/support/icons.jsm");
Cu.import("resource://dta/support/timers.jsm");

var Timers = new TimerManager();

ServiceGetter(this, "Atoms", "@mozilla.org/atom-service;1", "nsIAtomService");

extendString(String);

function FileExtensionSheet(window) {
	this._windowUtils = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
	
	let document = window.document;
	this._entries = {};
}

FileExtensionSheet.prototype = {
	getAtom: function FES_getAtom(fileName, metalink) {
		let ext = fileName.getExtension();
		if (!ext) {
			ext = 'unknown';
		}
		if (metalink) {
			ext = 'metalink';
		}
		let key = 'ext:' + ext;
		let entry = this._entries[key];
		if (!entry) {
			entry = "icon" + newUUIDString().replace(/\W/g, '');
			let rule = 'data:text/css,treechildren::-moz-tree-image(iconic,' 
				+ entry.toString()
				+ ') { list-style-image: url('
				+ getIcon('file.' + ext, metalink || ext == 'metalink')
				+ ') !important; -moz-image-region: auto !important; width: 16px !important;}';
			let ruleURI = Services.io.newURI(rule, null, null);
			Debug.log(ruleURI.spec);
			this._windowUtils.loadSheet(ruleURI, this._windowUtils.AGENT_SHEET);
			this._entries[key] = entry;
		}
		return Atoms.getAtom(entry);
	}
};
