window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  BrowserUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19ecfaN4pdAEIkfDtq28A+R", "BrowserUtil");
    "use strict";
    module.exports = {
      showCursorText: function showCursorText() {
        this.isCursorAuto() || this.setCursor("text");
      },
      showCursorPointer: function showCursorPointer() {
        this.isCursorAuto() || this.setCursor("pointer");
      },
      showCursorMove: function showCursorMove() {
        this.isCursorAuto() || this.setCursor("move");
      },
      showCursorAuto: function showCursorAuto() {
        this.isCursorAuto() || this.setCursor("auto");
      },
      showCursorShoot: function showCursorShoot() {
        cc.sys.isBrowser && (document.getElementById("GameDiv").style.cursor = "url('cursors/cursor-shot.png') 5 2, auto");
      },
      showCursorAutoForce: function showCursorAutoForce() {
        cc.sys.isBrowser && this.setCursor("auto");
      },
      isCursorAuto: function isCursorAuto() {
        return !!cc.sys.isBrowser && "auto" === document.getElementById("GameDiv").style.cursor;
      },
      setCursor: function setCursor(t) {
        cc.sys.isBrowser && (document.body.style.cursor = t);
      },
      showTooltip: function showTooltip(t) {
        cc.sys.isBrowser && (document.body.title = t);
      },
      focusGame: function focusGame() {
        cc.sys.isBrowser && document.getElementsByTagName("canvas")[0].focus();
      },
      getHTMLElementByEditBox: function getHTMLElementByEditBox(t) {
        return t._impl._edTxt;
      },
      checkEditBoxFocus: function checkEditBoxFocus(t) {
        return t.isFocused();
      },
      focusEditBox: function focusEditBox(t) {
        t._impl._edTxt.style.display = "block", t._impl._edTxt.focus();
        t.setFocus();
      },
      unFocusEditBox: function unFocusEditBox(t) {
        t._impl._edTxt.style.display = "none";
      },
      readOnlyEditBox: function readOnlyEditBox(t) {
        t.readOnly = !0;
      }
    };
    cc._RF.pop();
  }, {} ],
  Controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ceca7qYoP1BYqHReOtLawbs", "Controller");
    "use strict";
    var io = require("socket.io");
    cc.Class({
      extends: cc.Component,
      properties: {
        login: cc.Node,
        notice: cc.Node,
        panel: cc.Node,
        loading: cc.Node,
        taixiu: cc.Node,
        dialog: cc.Node
      },
      onLoad: function onLoad() {
        this.rights = 0;
        this.IS_LOGIN = false;
        this.io = io("/admin", {
          autoConnect: false
        });
        cc.TT = this;
        cc.io = this.io;
        this.login = this.login.getComponent("Login");
        this.notice = this.notice.getComponent("Notice");
        this.loading = this.loading.getComponent("Loading");
        this.panel = this.panel.getComponent("panel");
        this.dialog = this.dialog.getComponent("dialog");
        this.dialog.init();
        this.panel.init();
        this.TTdata();
      },
      reconnect: function reconnect() {
        this.io.disconnected && this.io.open();
      },
      auth: function auth(obj) {
        this.loading.show();
        this.reconnect();
        this.io.emit("authentication", obj);
      },
      post: function post(data) {
        this.io.emit("p", data);
      },
      TTdata: function TTdata() {
        var self = this;
        this.io.on("unauthorized", function(err) {
          self.authError(err);
        });
        this.io.on("p", function(data) {
          console.log(data);
          void 0 !== data.first && self.dataFirst(data.first);
          void 0 !== data.taixiu && self.panel.body.TaiXiu.onData(data.taixiu);
          void 0 !== data.admin && self.dataAdmin(data.admin);
          void 0 !== data.users && self.panel.body.Users.onData(data.users);
          void 0 !== data.nap_the && self.panel.body.NapThe.onData(data.nap_the);
          void 0 !== data.mua_the && self.panel.body.MuaThe.onData(data.mua_the);
          void 0 !== data.daily && self.panel.body.DaiLy.onData(data.daily);
          void 0 !== data.thecao && self.panel.body.TheCao.onData(data.thecao);
          void 0 !== data.giftcode && self.panel.body.GiftCode.onData(data.giftcode);
          void 0 !== data.notice && cc.TT.notice.show(data.notice.text, data.notice.title);
          void 0 !== data.error && cc.TT.notice.show(data.error, "ERROR");
        });
      },
      authError: function authError(err) {
        this.loading.close();
        cc.TT.notice.show(err.message);
      },
      dataUser: function dataUser(data) {},
      dataAdmin: function dataAdmin(data) {
        void 0 !== data.doi_pass && cc.TT.dialog.profile.doi_pass.onData(data.doi_pass);
      },
      isLogin: function isLogin() {
        this.IS_LOGIN = this.panel.node.active = true;
        this.loading.node.active = this.notice.node.active = this.login.node.active = false;
      },
      logout: function logout() {
        this.io.emit("logout", 1);
        this.io.disconnect();
        this.isLogout();
      },
      isLogout: function isLogout() {
        this.IS_LOGIN = this.loading.node.active = this.notice.node.active = this.panel.node.active = false;
        this.login.node.active = true;
        this.dialog.close();
        this.panel.body.TaiXiu.setLogout();
      },
      dataFirst: function dataFirst(data) {
        this.rights = data.rights;
        if (void 0 !== data.username) {
          this.panel.let_menu.username.string = data.username;
          this.dialog.profile.username.string = data.username;
        }
        if (void 0 !== data.rights) {
          this.panel.let_menu.rights.string = data.rights > 3 ? "SV" : "C\u1ea5p: " + data.rights;
          this.dialog.profile.rights.string = data.rights > 3 ? "SV" : "C\u1ea5p: " + data.rights;
        }
        this.isLogin();
      }
    });
    cc._RF.pop();
  }, {
    "socket.io": "socket.io"
  } ],
  1: [ function(require, module, exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len = b64.length;
      if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var validLen = b64.indexOf("=");
      -1 === validLen && (validLen = len);
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [ validLen, placeHoldersLen ];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      for (var i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      if (2 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = 255 & tmp;
      }
      if (1 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[63 & num];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (255 & uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      if (1 === extraBytes) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (2 === extraBytes) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }, {} ],
  2: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      var base64 = require("base64-js");
      var ieee754 = require("ieee754");
      var isArray = require("isarray");
      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      exports.kMaxLength = kMaxLength();
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42;
            }
          };
          return 42 === arr.foo() && "function" === typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength;
        } catch (e) {
          return false;
        }
      }
      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }
      function createBuffer(that, length) {
        if (kMaxLength() < length) throw new RangeError("Invalid typed array length");
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          null === that && (that = new Buffer(length));
          that.length = length;
        }
        return that;
      }
      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) return new Buffer(arg, encodingOrOffset, length);
        if ("number" === typeof arg) {
          if ("string" === typeof encodingOrOffset) throw new Error("If encoding is specified then the first argument must be a string");
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }
      Buffer.poolSize = 8192;
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };
      function from(that, value, encodingOrOffset, length) {
        if ("number" === typeof value) throw new TypeError('"value" argument must not be a number');
        if ("undefined" !== typeof ArrayBuffer && value instanceof ArrayBuffer) return fromArrayBuffer(that, value, encodingOrOffset, length);
        if ("string" === typeof value) return fromString(that, value, encodingOrOffset);
        return fromObject(that, value);
      }
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        "undefined" !== typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
      function assertSize(size) {
        if ("number" !== typeof size) throw new TypeError('"size" argument must be a number');
        if (size < 0) throw new RangeError('"size" argument must not be negative');
      }
      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) return createBuffer(that, size);
        if (void 0 !== fill) return "string" === typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        return createBuffer(that, size);
      }
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };
      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
        if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0;
        return that;
      }
      Buffer.allocUnsafe = function(size) {
        return allocUnsafe(null, size);
      };
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size);
      };
      function fromString(that, string, encoding) {
        "string" === typeof encoding && "" !== encoding || (encoding = "utf8");
        if (!Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
        var length = 0 | byteLength(string, encoding);
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);
        actual !== length && (that = that.slice(0, actual));
        return that;
      }
      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : 0 | checked(array.length);
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) that[i] = 255 & array[i];
        return that;
      }
      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength;
        if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("'offset' is out of bounds");
        if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("'length' is out of bounds");
        array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = array;
          that.__proto__ = Buffer.prototype;
        } else that = fromArrayLike(that, array);
        return that;
      }
      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = 0 | checked(obj.length);
          that = createBuffer(that, len);
          if (0 === that.length) return that;
          obj.copy(that, 0, 0, len);
          return that;
        }
        if (obj) {
          if ("undefined" !== typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || "length" in obj) {
            if ("number" !== typeof obj.length || isnan(obj.length)) return createBuffer(that, 0);
            return fromArrayLike(that, obj);
          }
          if ("Buffer" === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }
      function checked(length) {
        if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
        return 0 | length;
      }
      function SlowBuffer(length) {
        +length != length && (length = 0);
        return Buffer.alloc(+length);
      }
      Buffer.isBuffer = function isBuffer(b) {
        return !!(null != b && b._isBuffer);
      };
      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
        if (a === b) return 0;
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
         case "hex":
         case "utf8":
         case "utf-8":
         case "ascii":
         case "latin1":
         case "binary":
         case "base64":
         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return true;

         default:
          return false;
        }
      };
      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === list.length) return Buffer.alloc(0);
        var i;
        if (void 0 === length) {
          length = 0;
          for (i = 0; i < list.length; ++i) length += list[i].length;
        }
        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) return string.length;
        if ("undefined" !== typeof ArrayBuffer && "function" === typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
        "string" !== typeof string && (string = "" + string);
        var len = string.length;
        if (0 === len) return 0;
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "ascii":
         case "latin1":
         case "binary":
          return len;

         case "utf8":
         case "utf-8":
         case void 0:
          return utf8ToBytes(string).length;

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return 2 * len;

         case "hex":
          return len >>> 1;

         case "base64":
          return base64ToBytes(string).length;

         default:
          if (loweredCase) return utf8ToBytes(string).length;
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        (void 0 === start || start < 0) && (start = 0);
        if (start > this.length) return "";
        (void 0 === end || end > this.length) && (end = this.length);
        if (end <= 0) return "";
        end >>>= 0;
        start >>>= 0;
        if (end <= start) return "";
        encoding || (encoding = "utf8");
        while (true) switch (encoding) {
         case "hex":
          return hexSlice(this, start, end);

         case "utf8":
         case "utf-8":
          return utf8Slice(this, start, end);

         case "ascii":
          return asciiSlice(this, start, end);

         case "latin1":
         case "binary":
          return latin1Slice(this, start, end);

         case "base64":
          return base64Slice(this, start, end);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return utf16leSlice(this, start, end);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.prototype._isBuffer = true;
      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var i = 0; i < len; i += 2) swap(this, i, i + 1);
        return this;
      };
      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer.prototype.toString = function toString() {
        var length = 0 | this.length;
        if (0 === length) return "";
        if (0 === arguments.length) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return 0 === Buffer.compare(this, b);
      };
      Buffer.prototype.inspect = function inspect() {
        var str = "";
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
          this.length > max && (str += " ... ");
        }
        return "<Buffer " + str + ">";
      };
      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) throw new TypeError("Argument must be a Buffer");
        void 0 === start && (start = 0);
        void 0 === end && (end = target ? target.length : 0);
        void 0 === thisStart && (thisStart = 0);
        void 0 === thisEnd && (thisEnd = this.length);
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
        if (thisStart >= thisEnd && start >= end) return 0;
        if (thisStart >= thisEnd) return -1;
        if (start >= end) return 1;
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (0 === buffer.length) return -1;
        if ("string" === typeof byteOffset) {
          encoding = byteOffset;
          byteOffset = 0;
        } else byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648);
        byteOffset = +byteOffset;
        isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1);
        byteOffset < 0 && (byteOffset = buffer.length + byteOffset);
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (!dir) return -1;
          byteOffset = 0;
        }
        "string" === typeof val && (val = Buffer.from(val, encoding));
        if (Buffer.isBuffer(val)) {
          if (0 === val.length) return -1;
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        }
        if ("number" === typeof val) {
          val &= 255;
          if (Buffer.TYPED_ARRAY_SUPPORT && "function" === typeof Uint8Array.prototype.indexOf) return dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (void 0 !== encoding) {
          encoding = String(encoding).toLowerCase();
          if ("ucs2" === encoding || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding) {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i) {
          return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
        }
        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
            -1 === foundIndex && (foundIndex = i);
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            -1 !== foundIndex && (i -= i - foundIndex);
            foundIndex = -1;
          }
        } else {
          byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength);
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return -1 !== this.indexOf(val, byteOffset, encoding);
      };
      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (length) {
          length = Number(length);
          length > remaining && (length = remaining);
        } else length = remaining;
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
        length > strLen / 2 && (length = strLen / 2);
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(2 * i, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer.prototype.write = function write(string, offset, length, encoding) {
        if (void 0 === offset) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (void 0 === length && "string" === typeof offset) {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else {
          if (!isFinite(offset)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          offset |= 0;
          if (isFinite(length)) {
            length |= 0;
            void 0 === encoding && (encoding = "utf8");
          } else {
            encoding = length;
            length = void 0;
          }
        }
        var remaining = this.length - offset;
        (void 0 === length || length > remaining) && (length = remaining);
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        encoding || (encoding = "utf8");
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "hex":
          return hexWrite(this, string, offset, length);

         case "utf8":
         case "utf-8":
          return utf8Write(this, string, offset, length);

         case "ascii":
          return asciiWrite(this, string, offset, length);

         case "latin1":
         case "binary":
          return latin1Write(this, string, offset, length);

         case "base64":
          return base64Write(this, string, offset, length);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return ucs2Write(this, string, offset, length);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      };
      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
             case 1:
              firstByte < 128 && (codePoint = firstByte);
              break;

             case 2:
              secondByte = buf[i + 1];
              if (128 === (192 & secondByte)) {
                tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte;
                tempCodePoint > 127 && (codePoint = tempCodePoint);
              }
              break;

             case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte)) {
                tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte;
                tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint);
              }
              break;

             case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte)) {
                tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte;
                tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint);
              }
            }
          }
          if (null === codePoint) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | 1023 & codePoint;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
        var res = "";
        var i = 0;
        while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(127 & buf[i]);
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len = buf.length;
        (!start || start < 0) && (start = 0);
        (!end || end < 0 || end > len) && (end = len);
        var out = "";
        for (var i = start; i < end; ++i) out += toHex(buf[i]);
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
        return res;
      }
      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = void 0 === end ? len : ~~end;
        if (start < 0) {
          start += len;
          start < 0 && (start = 0);
        } else start > len && (start = len);
        if (end < 0) {
          end += len;
          end < 0 && (end = 0);
        } else end > len && (end = len);
        end < start && (end = start);
        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, void 0);
          for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start];
        }
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        return val;
      };
      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
        return val;
      };
      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3];
      };
      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        if (!(128 & this[offset])) return this[offset];
        return -1 * (255 - this[offset] + 1);
      };
      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var mul = 1;
        var i = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 255, 0);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        this[offset] = 255 & value;
        return offset + 1;
      };
      function objectWriteUInt16(buf, value, offset, littleEndian) {
        value < 0 && (value = 65535 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i);
      }
      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      function objectWriteUInt32(buf, value, offset, littleEndian) {
        value < 0 && (value = 4294967295 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255;
      }
      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = 255 & value;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 127, -128);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        value < 0 && (value = 255 + value + 1);
        this[offset] = 255 & value;
        return offset + 1;
      };
      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        value < 0 && (value = 4294967295 + value + 1);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38);
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308);
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        start || (start = 0);
        end || 0 === end || (end = this.length);
        targetStart >= target.length && (targetStart = target.length);
        targetStart || (targetStart = 0);
        end > 0 && end < start && (end = start);
        if (end === start) return 0;
        if (0 === target.length || 0 === this.length) return 0;
        if (targetStart < 0) throw new RangeError("targetStart out of bounds");
        if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        end > this.length && (end = this.length);
        target.length - targetStart < end - start && (end = target.length - targetStart + start);
        var len = end - start;
        var i;
        if (this === target && start < targetStart && targetStart < end) for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]; else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]; else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        return len;
      };
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        if ("string" === typeof val) {
          if ("string" === typeof start) {
            encoding = start;
            start = 0;
            end = this.length;
          } else if ("string" === typeof end) {
            encoding = end;
            end = this.length;
          }
          if (1 === val.length) {
            var code = val.charCodeAt(0);
            code < 256 && (val = code);
          }
          if (void 0 !== encoding && "string" !== typeof encoding) throw new TypeError("encoding must be a string");
          if ("string" === typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        } else "number" === typeof val && (val &= 255);
        if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
        if (end <= start) return this;
        start >>>= 0;
        end = void 0 === end ? this.length : end >>> 0;
        val || (val = 0);
        var i;
        if ("number" === typeof val) for (i = start; i < end; ++i) this[i] = val; else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
        }
        return this;
      };
      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = stringtrim(str).replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) str += "=";
        return str;
      }
      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, "");
      }
      function toHex(n) {
        if (n < 16) return "0" + n.toString(16);
        return n.toString(16);
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              if (i + 1 === length) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              (units -= 3) > -1 && bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = 65536 + (leadSurrogate - 55296 << 10 | codePoint - 56320);
          } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          } else {
            if (!(codePoint < 1114112)) throw new Error("Invalid code point");
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) byteArray.push(255 & str.charCodeAt(i));
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isnan(val) {
        return val !== val;
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "base64-js": 1,
    ieee754: 4,
    isarray: 3
  } ],
  3: [ function(require, module, exports) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return "[object Array]" == toString.call(arr);
    };
  }, {} ],
  4: [ function(require, module, exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (;nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8) ;
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (;nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8) ;
      if (0 === e) e = 1 - eBias; else {
        if (e === eMax) return m ? NaN : Infinity * (s ? -1 : 1);
        m += Math.pow(2, mLen);
        e -= eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || Infinity === value) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e += eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (;mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8) ;
      e = e << mLen | m;
      eLen += mLen;
      for (;eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8) ;
      buffer[offset + i - d] |= 128 * s;
    };
  }, {} ],
  DaiLy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6e72258RxhDF52wrDKjwVPx", "DaiLy");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        itemfab: cc.Prefab,
        scrollView: cc.ScrollView,
        isLoad: false
      },
      onEnable: function onEnable() {
        !this.isLoad && this.get_data();
      },
      get_data: function get_data() {
        var page = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.isLoad = true;
        cc.TT.post({
          shop: {
            daily: {
              get_data: true
            }
          }
        });
      },
      onData: function onData(data) {
        this.reNew();
        this.isLoad = false;
        if (data.length > 0) {
          var self = this;
          Promise.all(data.map(function(obj, index) {
            var item = cc.instantiate(self.itemfab);
            var itemComponent = item.getComponent("item_daily");
            itemComponent.stt.string = index + 1;
            itemComponent.nameT.string = obj.name;
            itemComponent.username.string = obj.nickname;
            itemComponent.phone.string = obj.phone;
            itemComponent.fb.string = obj.fb;
            itemComponent.idD = obj._id;
            self.scrollView.content.addChild(item);
            return;
          }));
        }
      },
      reNew: function reNew() {
        this.scrollView.content.destroyAllChildren();
      }
    });
    cc._RF.pop();
  }, {} ],
  Games: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d4034lKuG5AiKPyA5NVb+59", "Games");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  GiftCode_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "38b4bJPnNtD4quKZE3bLHc/", "GiftCode_item");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        time: cc.Label,
        code: cc.Label,
        red: cc.Label,
        xu: cc.Label,
        status: cc.Label,
        chung: cc.Label,
        han: cc.Label
      },
      remove: function remove() {
        cc.TT.dialog.giftcodeRemove(this.data._id);
      },
      setData: function setData() {
        this.time.string = Helper.date("HH:mm dd/MM/yyyy", this.data.date);
        this.code.string = this.data.code;
        this.red.string = Helper.numberToBet(this.data.red);
        this.xu.string = Helper.numberToBet(this.data.xu);
        this.status.string = void 0 === this.data.uid ? "" : "\u0110\xe3 n\u1ea1p";
        this.chung.string = this.data.type;
        this.han.string = Helper.date("dd/MM/yyyy", this.data.todate);
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  GiftCode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ab36R+LddKC5j0qSyRJVjX", "GiftCode");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        pagination: cc.Node,
        isLoad: false
      },
      onLoad: function onLoad() {
        var _this = this;
        this.pagination = this.pagination.getComponent("Pagination");
        Promise.all(this.content.children.map(function(obj) {
          return obj.getComponent("GiftCode_item");
        })).then(function(values) {
          _this.content2 = values;
        });
        this.pagination.init(this);
      },
      onEnable: function onEnable() {
        !this.isLoad && this.get_data();
      },
      onDisable: function onDisable() {
        this.reset();
      },
      reset: function reset() {
        this.isLoad = false;
      },
      get_data: function get_data() {
        var page = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.isLoad = true;
        cc.TT.post({
          giftcode: {
            get_data: {
              page: page
            }
          }
        });
      },
      onData: function onData(data) {
        void 0 !== data.get_data && this.setData(data.get_data);
        void 0 !== data.create_gift && (cc.TT.dialog.giftcode.giftcode.string = data.create_gift);
      },
      setData: function setData(data) {
        var self = this;
        this.pagination.onSet(data.page, data.kmess, data.total);
        this.content2.map(function(obj, i) {
          var dataT = data.data[i];
          if (void 0 !== dataT) {
            self.content.children[i].active = true;
            obj.data = dataT;
            obj.setData();
          } else self.content.children[i].active = false;
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  Helper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97bfb4BUgJDkoXJ527+7ZSJ", "Helper");
    "use strict";
    function isEmpty(str) {
      return !str || 0 === str.length;
    }
    function numberToBet(number) {
      isEmpty(number) && (number = 0);
      return new Intl.NumberFormat("vi-VN").format(number);
    }
    function DotToNumber(str) {
      return isEmpty(str) ? 0 : parseInt(str.replace(/\./gi, ""));
    }
    function DotToBet(str) {
      return numberToBet(DotToNumber(str));
    }
    function numberPad(number, length) {
      var str = "" + number;
      while (str.length < length) str = "0" + str;
      return str;
    }
    function inputNumber(obj) {
      var onShift = false;
      obj.addEventListener("keydown", function(e) {
        if (16 === e.keyCode) {
          e.preventDefault();
          onShift = true;
        }
      });
      obj.addEventListener("keyup", function(e) {
        if (16 === e.keyCode) {
          e.preventDefault();
          onShift = false;
        }
      });
      obj.addEventListener("keydown", function(e) {
        !onShift && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 37 && e.keyCode <= 40 || 107 === e.keyCode || 109 === e.keyCode || 189 === e.keyCode || 8 === e.keyCode || 13 === e.keyCode) || e.preventDefault();
      });
    }
    function formatDate(date, format) {
      var utc = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
      var MMMM = [ "\0", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
      var MMM = [ "\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      var dddd = [ "\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
      var ddd = [ "\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
      function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
      }
      var y = utc ? date.getUTCFullYear() : date.getFullYear();
      format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
      format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
      format = format.replace(/(^|[^\\])y/g, "$1" + y);
      var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
      format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
      format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
      format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
      format = format.replace(/(^|[^\\])M/g, "$1" + M);
      var d = utc ? date.getUTCDate() : date.getDate();
      format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
      format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
      format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
      format = format.replace(/(^|[^\\])d/g, "$1" + d);
      var H = utc ? date.getUTCHours() : date.getHours();
      format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
      format = format.replace(/(^|[^\\])H/g, "$1" + H);
      var h = H > 12 ? H - 12 : 0 == H ? 12 : H;
      format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
      format = format.replace(/(^|[^\\])h/g, "$1" + h);
      var m = utc ? date.getUTCMinutes() : date.getMinutes();
      format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
      format = format.replace(/(^|[^\\])m/g, "$1" + m);
      var s = utc ? date.getUTCSeconds() : date.getSeconds();
      format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
      format = format.replace(/(^|[^\\])s/g, "$1" + s);
      var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
      format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
      f = Math.round(f / 10);
      format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
      f = Math.round(f / 10);
      format = format.replace(/(^|[^\\])f/g, "$1" + f);
      var T = H < 12 ? "AM" : "PM";
      format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
      format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));
      var t = T.toLowerCase();
      format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
      format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));
      var tz = -date.getTimezoneOffset();
      var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
      if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
      }
      format = format.replace(/(^|[^\\])K/g, "$1" + K);
      var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
      format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
      format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);
      format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
      format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);
      format = format.replace(/\\(.)/g, "$1");
      return format;
    }
    function date(format) {
      var time = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      if (time) {
        var d = new Date(time);
        return formatDate(d, format);
      }
      return formatDate(new Date(), format);
    }
    module.exports = {
      numberToBet: numberToBet,
      isEmpty: isEmpty,
      DotToNumber: DotToNumber,
      DotToBet: DotToBet,
      numberPad: numberPad,
      inputNumber: inputNumber,
      formatDate: formatDate,
      date: date
    };
    cc._RF.pop();
  }, {} ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9f42nY+KdGtqLboBdxaVmY", "Loading");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        ss: cc.Node
      },
      onEnable: function onEnable() {
        this.ss.runAction(cc.rotateTo(1.5, -1080).repeatForever());
        this.node.on("touchstart", function(event) {
          event.stopPropagation();
        });
        this.node.on("touchend", function(event) {
          event.stopPropagation();
        });
      },
      onDisable: function onDisable() {
        this.node.off("touchstart", function(event) {
          event.stopPropagation();
        });
        this.node.off("touchend", function(event) {
          event.stopPropagation();
        });
        this.ss.stopAllActions();
        this.ss.angle = 0;
      },
      close: function close() {
        this.node.active = false;
      },
      show: function show() {
        this.node.active = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  Login: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bcf38VhdhBAPqdIM0AW3sKR", "Login");
    "use strict";
    var BrowserUtil = require("BrowserUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        inputName: cc.EditBox,
        inputPass: cc.EditBox
      },
      onLoad: function onLoad() {
        var self = this;
        this.editboxs = [ this.inputName, this.inputPass ];
        this.keyHandle = function(t) {
          return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(), t.preventDefault && t.preventDefault(), 
          !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onLoginClick(), 
          t.preventDefault && t.preventDefault(), !1) : void 0;
        };
      },
      onEnable: function onEnable() {
        cc.sys.isBrowser && this.addEventTT();
      },
      onDisable: function onDisable() {
        cc.sys.isBrowser && this.removeEventTT();
        this.clean();
      },
      addEventTT: function addEventTT() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1);
      },
      removeEventTT: function removeEventTT() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.tab:
          this.isTop() && this.changeNextFocusEditBox();
          break;

         case cc.macro.KEY.enter:
          this.isTop() && this.onLoginClick();
        }
      },
      changeNextFocusEditBox: function changeNextFocusEditBox() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++) if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
          i <= ++e && (e = 0), BrowserUtil.focusEditBox(this.editboxs[e]), t = !0;
          break;
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
      },
      isTop: function isTop() {
        return !cc.TT.notice.node.active && !cc.TT.loading.node.active;
      },
      clean: function clean() {
        this.inputName.string = this.inputPass.string = "";
      },
      onLoginClick: function onLoginClick() {
        var error = null;
        this.inputName.string.length > 32 || this.inputName.string.length < 5 || null === this.inputName.string.match(new RegExp("^[a-zA-Z0-9]+$")) ? error = "T\xean t\xe0i kho\u1ea3n kh\xf4ng \u0111\xfang!!" : (this.inputPass.string.length > 32 || this.inputPass.string.length < 5) && (error = "M\u1eadt kh\u1ea9u kh\xf4ng \u0111\xfang!!");
        if (error) {
          cc.TT.notice.show(error, "\u0110\u0102NG NH\u1eacP");
          return;
        }
        cc.TT.auth({
          username: this.inputName.string,
          password: this.inputPass.string
        });
      }
    });
    cc._RF.pop();
  }, {
    BrowserUtil: "BrowserUtil"
  } ],
  MuaThe_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a25ceZTTP5EKaw/5LzpDSe6", "MuaThe_item");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        time: cc.Label,
        username: cc.Label,
        nhaMang: cc.Label,
        menhGia: cc.Label,
        soLuong: cc.Label,
        status: cc.Label
      },
      openChanger: function openChanger() {
        cc.TT.dialog.openMuaThe(this.data._id, this.card, this);
      },
      setData: function setData() {
        this.time.string = Helper.date("HH:mm dd/MM/yyyy", this.data.time);
        this.username.string = this.data.name;
        this.nhaMang.string = this.data.nhaMang;
        this.menhGia.string = this.data.menhGia;
        this.soLuong.string = this.data.soLuong;
        this.status.string = 0 == this.data.status ? "Ch\u1edd duy\u1ec7t" : "\u0110\xe3 duy\u1ec7t";
        this.status.node.color = 0 == this.data.status ? cc.color(45, 171, 255, 255) : cc.color(0, 255, 71, 255);
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  MuaThe: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91013KSjP5AvKAWG+Yuqezf", "MuaThe");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        pagination: cc.Node,
        isLoad: false
      },
      onLoad: function onLoad() {
        this.status = "-1";
        this.pagination = this.pagination.getComponent("Pagination");
        this.content2 = this.content.children.map(function(obj) {
          return obj.getComponent("MuaThe_item");
        });
        this.pagination.init(this);
      },
      onEnable: function onEnable() {
        !this.isLoad && this.get_data();
      },
      onDisable: function onDisable() {
        this.reset();
      },
      reset: function reset() {
        this.isLoad = false;
      },
      get_data: function get_data() {
        var page = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.isLoad = true;
        cc.TT.post({
          mua_the: {
            get_data: {
              status: this.status,
              page: page
            }
          }
        });
      },
      onData: function onData(data) {
        void 0 !== data.get_data && this.setData(data.get_data);
        void 0 !== data.set_data && cc.TT.dialog.muathe.onEmitData(data.set_data);
      },
      setData: function setData(data) {
        var self = this;
        this.pagination.onSet(data.page, data.kmess, data.total);
        this.content2.map(function(obj, i) {
          if (void 0 !== data.data[i]) {
            self.content.children[i].active = true;
            obj.data = data.data[i];
            obj.card = data.card[i];
            obj.setData();
          } else self.content.children[i].active = false;
        });
      },
      changerStatus: function changerStatus(event, data) {
        this.status = data;
        this.get_data();
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  NapThe_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1ca14X0LNpNv70bcaRprQnZ", "NapThe_item");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        time: cc.Label,
        username: cc.Label,
        nhaMang: cc.Label,
        menhGia: cc.Label,
        nhan: cc.Label,
        maThe: cc.Label,
        seri: cc.Label,
        status: cc.Label
      },
      onClickChanger: function onClickChanger() {
        cc.TT.dialog.openNapThe(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  NapThe: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48a9e4C7MtPjKfxPqIu2nmM", "NapThe");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        pagination: cc.Node,
        isLoad: false
      },
      onLoad: function onLoad() {
        this.status = "-1";
        this.pagination = this.pagination.getComponent("Pagination");
        this.content2 = this.content.children.map(function(obj) {
          return obj.getComponent("NapThe_item");
        });
        this.pagination.init(this);
      },
      onEnable: function onEnable() {
        !this.isLoad && this.get_data();
      },
      onDisable: function onDisable() {
        this.reset();
      },
      reset: function reset() {
        this.isLoad = false;
      },
      get_data: function get_data() {
        var page = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.isLoad = true;
        cc.TT.post({
          nap_the: {
            get_data: {
              status: this.status,
              page: page
            }
          }
        });
      },
      onData: function onData(data) {
        void 0 !== data.get_data && this.setData(data.get_data);
        void 0 !== data.set_data && cc.TT.dialog.napthe.onEmitData(data.set_data);
      },
      setData: function setData(data) {
        var self = this;
        this.pagination.onSet(data.page, data.kmess, data.total);
        this.content2.map(function(obj, i) {
          var dataT = data.data[i];
          if (void 0 !== dataT) {
            self.content.children[i].active = true;
            obj.data = dataT;
            obj.time.string = Helper.date("HH:mm dd/MM/yyyy", dataT.time);
            obj.username.string = dataT.name;
            obj.nhaMang.string = dataT.nhaMang;
            obj.menhGia.string = dataT.menhGia;
            obj.nhan.string = Helper.numberToBet(dataT.nhan);
            obj.maThe.string = dataT.maThe;
            obj.seri.string = dataT.seri;
            obj.status.string = 0 == dataT.status ? "Ch\u1edd duy\u1ec7t" : 1 == dataT.status ? "N\u1ea1p th\xe0nh c\xf4ng" : 2 == dataT.status ? "N\u1ea1p th\u1ea5t b\u1ea1i" : "";
            obj.status.node.color = 0 == dataT.status ? cc.color(45, 171, 255, 255) : 1 == dataT.status ? cc.color(0, 255, 71, 255) : 2 == dataT.status ? cc.color(255, 0, 0, 255) : cc.color(45, 171, 255, 255);
          } else self.content.children[i].active = false;
        });
      },
      changerStatus: function changerStatus(event, data) {
        this.status = data;
        this.get_data();
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  NhaMang: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1b5a3VFkTBJsoZwCeKDTIqk", "NhaMang");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  Notice: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4f77dH2gzVC6qAzyuaR6VjW", "Notice");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        ButtonClose: cc.Node,
        LabelTitle: cc.Label,
        LabelText: cc.Label
      },
      onLoad: function onLoad() {
        var self = this;
        this.eventClicCloseStart = function(event) {};
        this.eventClicCloseEnd = function(event) {
          self.node.active = false;
        };
      },
      onEnable: function onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.ButtonClose.on("touchstart", this.eventClicCloseStart);
        this.ButtonClose.on("touchend", this.eventClicCloseEnd);
      },
      onDisable: function onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.LabelTitle.string = "TH\xd4NG B\xc1O";
        this.LabelText.string = "N\u1ebfu b\u1ea1n th\u1ea5y \u0111i\u1ec1u n\xe0y, c\xf3 th\u1ec3 h\u1ec7 th\u1ed1ng \u0111\xe3 g\u1eb7p s\u1ef1 c\u1ed1!";
        this.ButtonClose.off("touchstart", this.eventClicCloseStart);
        this.ButtonClose.off("touchend", this.eventClicCloseEnd);
      },
      show: function show(text) {
        var title = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "TH\xd4NG B\xc1O";
        this.node.active = true;
        this.LabelTitle.string = title;
        this.LabelText.string = text;
      },
      onKeyDown: function onKeyDown(event) {
        var self = this;
        switch (event.keyCode) {
         case cc.macro.KEY.escape:
         case cc.macro.KEY.enter:
          self.node.active = false;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Pagination_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b4f3421NNGbph0doFMss2q", "Pagination_item");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bg: cc.Node,
        bg_select: cc.Node,
        number: cc.Label
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  Pagination: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06700KZQo5LOp4dSSzFumL8", "Pagination");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        nodeFirst: cc.Node,
        nodePrevious: cc.Node,
        nodePage1: cc.Node,
        nodePage2: cc.Node,
        nodePage3: cc.Node,
        nodePage4: cc.Node,
        nodePage5: cc.Node,
        nodeNext: cc.Node,
        nodeLast: cc.Node,
        page: 1,
        kmess: 10,
        totall: 0
      },
      init: function init(obj) {
        this.controll = obj;
        this.objSelect = null;
        this.nodePage1 = this.nodePage1.getComponent("Pagination_item");
        this.nodePage2 = this.nodePage2.getComponent("Pagination_item");
        this.nodePage3 = this.nodePage3.getComponent("Pagination_item");
        this.nodePage4 = this.nodePage4.getComponent("Pagination_item");
        this.nodePage5 = this.nodePage5.getComponent("Pagination_item");
        this.arrO = [ this.nodePage1, this.nodePage2, this.nodePage3, this.nodePage4, this.nodePage5 ];
      },
      select: function select(obj) {
        obj.number.string = this.page;
        obj.number.node.color = cc.Color.BLACK;
        obj.bg.active = false;
        obj.bg_select.active = true;
        this.objSelect = obj;
        obj.node.pauseSystemEvents();
        return;
      },
      unSelect: function unSelect(obj, page) {
        obj.number.string = page;
        obj.number.node.color = cc.Color.WHITE;
        obj.bg.active = true;
        obj.bg_select.active = false;
        obj.node.page = page;
        obj.node.resumeSystemEvents();
      },
      onSet: function onSet(page, kmess, totall) {
        var _this = this;
        var self = this;
        this.page = page;
        this.kmess = kmess;
        this.totall = totall;
        this.totalPage = Math.ceil(this.totall / this.kmess);
        this.pageRed = this.totalPage - this.page;
        if (totall > 0) {
          this.node.active = true;
          Promise.all(this.arrO.map(function(obj, i) {
            self.totalPage > 4 ? obj.node.active = true : i < self.totalPage ? obj.node.active = true : obj.node.active = false;
            self.page > 2 ? self.nodeFirst.active = true : self.nodeFirst.active = false;
            self.pageRed > 1 ? self.nodeLast.active = true : self.nodeLast.active = false;
            self.page > 1 ? self.nodePrevious.active = true : self.nodePrevious.active = false;
            self.pageRed > 0 ? self.nodeNext.active = true : self.nodeNext.active = false;
            if (0 == i && 1 == self.page) return self.select(obj);
            if (1 == i && 2 == self.page) return self.select(obj);
            if (2 == i && (3 == self.page || self.totalPage > 5 && 1 !== self.page && 2 !== self.page && self.totalPage - 2 >= self.page)) return self.select(obj);
            if (3 == i && (4 == self.totalPage && 4 == self.page || self.totalPage > 4 && self.totalPage - 1 == self.page)) return self.select(obj);
            if (4 == i && self.totalPage > 4 && self.page == self.totalPage) return self.select(obj);
          })).then(function(va) {
            Promise.all(_this.arrO.map(function(obj, i) {
              obj !== self.objSelect && (0 == i ? "page2" == self.objSelect.node.name ? self.unSelect(obj, self.objSelect.number.string - 1) : "page3" == self.objSelect.node.name ? self.unSelect(obj, self.objSelect.number.string - 2) : "page4" == self.objSelect.node.name ? self.unSelect(obj, self.objSelect.number.string - 3) : "page5" == self.objSelect.node.name && self.unSelect(obj, self.objSelect.number.string - 4) : 1 == i ? "page1" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 1) : "page3" == self.objSelect.node.name ? self.unSelect(obj, self.objSelect.number.string - 1) : "page4" == self.objSelect.node.name ? self.unSelect(obj, self.objSelect.number.string - 2) : "page5" == self.objSelect.node.name && self.unSelect(obj, self.objSelect.number.string - 3) : 2 == i ? "page1" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 2) : "page2" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 1) : "page4" == self.objSelect.node.name ? self.unSelect(obj, self.objSelect.number.string - 1) : "page5" == self.objSelect.node.name && self.unSelect(obj, self.objSelect.number.string - 2) : 3 == i ? "page1" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 3) : "page2" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 2) : "page3" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 1) : "page5" == self.objSelect.node.name && self.unSelect(obj, self.objSelect.number.string - 1) : 4 == i && ("page1" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 4) : "page2" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 3) : "page3" == self.objSelect.node.name ? self.unSelect(obj, 1 * self.objSelect.number.string + 2) : "page4" == self.objSelect.node.name && self.unSelect(obj, 1 * self.objSelect.number.string + 1)));
            }));
          });
        } else this.node.active = false;
      },
      onClickFirst: function onClickFirst() {
        this.controll.get_data();
      },
      onClickPrevious: function onClickPrevious() {
        var page = this.objSelect.number.string - 1;
        page > 0 && this.controll.get_data(page);
      },
      onClickPage: function onClickPage(event) {
        this.controll.get_data(event.target.page);
      },
      onClickNext: function onClickNext() {
        var page = 1 * this.objSelect.number.string + 1;
        var totall = Math.ceil(this.totall / this.kmess);
        page <= totall && this.controll.get_data(page);
      },
      onClickLast: function onClickLast() {
        this.controll.get_data(Math.ceil(this.totall / this.kmess));
      }
    });
    cc._RF.pop();
  }, {} ],
  SubMenuHead: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e25fbP/7RBADYEpnKRc4qd+", "SubMenuHead");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bg: cc.Node,
        bgAc: cc.Node,
        content: cc.Node,
        text: cc.Node
      }
    });
    cc._RF.pop();
  }, {} ],
  SubMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01ca8n+9XhHF4gasH6QOEp6", "SubMenu");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        var self = this;
        Promise.all(this.node.children.map(function(obj) {
          return obj.getComponent("SubMenuHead");
        })).then(function(values) {
          self.cHead = values;
        });
      },
      select: function select(event) {
        var obj = event.target;
        Promise.all(this.cHead.map(function(o) {
          if (o.node.name == obj.name) {
            o.bg.active = false;
            o.bgAc.active = o.content.active = true;
            o.text.color = cc.Color.BLACK;
            o.node.pauseSystemEvents();
          } else {
            o.bg.active = true;
            o.bgAc.active = o.content.active = false;
            o.text.color = cc.Color.WHITE;
            o.node.resumeSystemEvents();
          }
          return;
        }));
      }
    });
    cc._RF.pop();
  }, {} ],
  TaiXiu_Main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1813awCMVJC2au9o5LhwAXr", "TaiXiu_Main");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        dice: {
          default: [],
          type: cc.SpriteFrame
        },
        dice1: cc.Sprite,
        dice2: cc.Sprite,
        dice3: cc.Sprite,
        nodeSelect: cc.Node,
        textPhien: cc.Label,
        time: cc.Label,
        tx_red_tong_tai: cc.Label,
        tx_red_tong_xiu: cc.Label,
        tx_red_users_tai: cc.Label,
        tx_red_users_xiu: cc.Label,
        tx_xu_tong_tai: cc.Label,
        tx_xu_tong_xiu: cc.Label,
        tx_xu_users_tai: cc.Label,
        tx_xu_users_xiu: cc.Label,
        cl_red_tong_chan: cc.Label,
        cl_red_tong_le: cc.Label,
        cl_red_users_chan: cc.Label,
        cl_red_users_le: cc.Label,
        cl_xu_tong_chan: cc.Label,
        cl_xu_tong_le: cc.Label,
        cl_xu_users_chan: cc.Label,
        cl_xu_users_le: cc.Label
      },
      onLoad: function onLoad() {
        var self = this;
        this.diceSelect = null;
        this.dice1.dice = 0;
        this.dice2.dice = 0;
        this.dice3.dice = 0;
      },
      onEnable: function onEnable() {},
      onDisable: function onDisable() {},
      diceClick: function diceClick(event, data) {
        switch (data) {
         case "1":
          this.nodeSelect.position = cc.v2(this.dice1.node.position.x, this.dice1.node.position.y + 70);
          this.diceSelect = this.dice1;
          break;

         case "2":
          this.nodeSelect.position = cc.v2(this.dice2.node.position.x, this.dice2.node.position.y + 70);
          this.diceSelect = this.dice2;
          break;

         case "3":
          this.nodeSelect.position = cc.v2(this.dice3.node.position.x, this.dice3.node.position.y + 70);
          this.diceSelect = this.dice3;
        }
        this.nodeSelect.active = true;
      },
      diceSelectClick: function diceSelectClick(event, data) {
        this.diceSelect.spriteFrame = this.dice[data - 1];
        this.diceSelect.dice = data;
        this.nodeSelect.active = false;
      },
      setDice: function setDice() {
        cc.TT.post({
          taixiu: {
            set_dice: {
              dice1: this.dice1.dice,
              dice2: this.dice2.dice,
              dice3: this.dice3.dice
            }
          }
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  TaiXiu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb0f04KR6dCt6Zr6kVm533A", "TaiXiu");
    "use strict";
    var helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        TX_Main: cc.Node
      },
      init: function init() {
        this.getLogs = false;
        this.TX_Main = this.TX_Main.getComponent("TaiXiu_Main");
      },
      onEnable: function onEnable() {
        cc.TT.post({
          taixiu: this.getLogs ? {
            view: true
          } : {
            view: true,
            getLogs: true
          }
        });
      },
      onDisable: function onDisable() {
        cc.TT.post({
          taixiu: {
            view: false
          }
        });
      },
      show: function show() {
        this.node.active = true;
      },
      close: function close() {
        this.node.active = false;
      },
      onData: function onData(data) {
        if (void 0 !== data.time_remain) {
          this.time_remain = data.time_remain - 1;
          this.playTime();
        }
        void 0 !== data.dice && this.onDice(data.dice);
        if (void 0 !== data.finish && cc.TT.IS_LOGIN) {
          this.phien = data.finish.phien;
          this.TX_Main.textPhien.string = "Phi\xean: " + data.finish.phien + 1;
          this.time_remain = 81;
          this.playTime();
        }
        if (void 0 !== data.taixiu) {
          this.TX_Main.tx_red_tong_tai.string = data.taixiu.red_tai;
          this.TX_Main.tx_red_tong_xiu.string = data.taixiu.red_xiu;
          this.TX_Main.tx_red_users_tai.string = data.taixiu.red_player_tai;
          this.TX_Main.tx_red_users_xiu.string = data.taixiu.red_player_xiu;
          this.TX_Main.tx_xu_tong_tai.string = data.taixiu.xu_tai;
          this.TX_Main.tx_xu_tong_xiu.string = data.taixiu.xu_xiu;
          this.TX_Main.tx_xu_users_tai.string = data.taixiu.xu_player_tai;
          this.TX_Main.tx_xu_users_xiu.string = data.taixiu.xu_player_xiu;
        }
        if (void 0 !== data.chanle) {
          this.TX_Main.cl_red_tong_chan.string = data.chanle.red_chan;
          this.TX_Main.cl_red_tong_le.string = data.chanle.red_le;
          this.TX_Main.cl_red_users_chan.string = data.chanle.red_player_chan;
          this.TX_Main.cl_red_users_le.string = data.chanle.red_player_le;
          this.TX_Main.cl_xu_tong_chan.string = data.chanle.xu_chan;
          this.TX_Main.cl_xu_tong_le.string = data.chanle.xu_le;
          this.TX_Main.cl_xu_users_chan.string = data.chanle.xu_player_chan;
          this.TX_Main.cl_xu_users_le.string = data.chanle.xu_player_le;
        }
      },
      playTime: function playTime() {
        void 0 !== this.timeInterval && clearInterval(this.timeInterval);
        this.timeInterval = setInterval(function() {
          console.log(this.time_remain);
          if (this.time_remain >= 0) {
            this.TX_Main.time.string = "00:" + helper.numberPad(this.time_remain > 60 ? this.time_remain - 61 : this.time_remain, 2);
            this.time_remain > 60 ? this.TX_Main.time.node.color = cc.color(255, 0, 0, 255) : this.TX_Main.time.node.color = cc.Color.WHITE;
          } else clearInterval(this.timeInterval);
          this.time_remain--;
        }.bind(this), 1e3);
      },
      onDice: function onDice(data) {
        this.TX_Main.dice1.spriteFrame = this.TX_Main.dice[0 == data.dice1 ? 6 : data.dice1 - 1];
        this.TX_Main.dice2.spriteFrame = this.TX_Main.dice[0 == data.dice2 ? 6 : data.dice2 - 1];
        this.TX_Main.dice3.spriteFrame = this.TX_Main.dice[0 == data.dice3 ? 6 : data.dice3 - 1];
      },
      setLogout: function setLogout() {
        clearInterval(this.timeInterval);
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  TheCao_itemMenhGia: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "95d69BWY9VF9aBJQuKl0Wx8", "TheCao_itemMenhGia");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        menhGia: cc.Label,
        values: cc.Label,
        nap: cc.Label,
        mua: cc.Label
      },
      onClickRemove: function onClickRemove() {
        cc.TT.dialog.thecaoRMG(this.data._id);
      },
      setData: function setData() {
        this.menhGia.string = this.data.name;
        this.values.string = Helper.numberToBet(this.data.values);
        this.nap.string = this.data.nap ? "C\xf3" : "";
        this.mua.string = this.data.mua ? "C\xf3" : "";
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  TheCao_itemNhaMang: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4215/j8SdJo4UU5//FOEHl", "TheCao_itemNhaMang");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        labelName: cc.Label,
        labelNap: cc.Label,
        labelMua: cc.Label
      },
      onRemove: function onRemove() {
        cc.TT.dialog.thecaoRNM(this.data._id, this.data.name);
      },
      onSet: function onSet() {
        this.labelName.string = this.data.name;
        this.labelNap.string = this.data.nap ? "C\xf3" : "";
        this.labelMua.string = this.data.mua ? "C\xf3" : "";
      }
    });
    cc._RF.pop();
  }, {} ],
  TheCao: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "60446FJIW5BBL35v9I9gAuH", "TheCao");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        cNhaMang: cc.ScrollView,
        cMenhGia: cc.ScrollView,
        prefabNhaMang: cc.Prefab,
        prefabMenhGia: cc.Prefab,
        isLoad: false
      },
      onEnable: function onEnable() {
        !this.isLoad && this.get_data();
      },
      get_data: function get_data() {
        var page = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.isLoad = true;
        cc.TT.post({
          shop: {
            nhamang: {
              get_data: true
            },
            menhgia: {
              get_data: true
            }
          }
        });
      },
      onData: function onData(data) {
        this.isLoad = false;
        if (void 0 !== data.nhamang) {
          this.NhaMang_clear();
          this.NhaMang_data(data.nhamang);
        }
        if (void 0 !== data.menhgia) {
          this.MenhGia_clear();
          this.MenhGia_data(data.menhgia);
        }
      },
      NhaMang_data: function NhaMang_data(data) {
        if (data.length > 0) {
          var self = this;
          Promise.all(data.map(function(obj) {
            var item = cc.instantiate(self.prefabNhaMang);
            var itemComponent = item.getComponent("TheCao_itemNhaMang");
            itemComponent.data = obj;
            itemComponent.onSet();
            self.cNhaMang.content.addChild(item);
            return;
          }));
        }
      },
      MenhGia_data: function MenhGia_data(data) {
        if (data.length > 0) {
          var self = this;
          Promise.all(data.map(function(obj) {
            var item = cc.instantiate(self.prefabMenhGia);
            var itemComponent = item.getComponent("TheCao_itemMenhGia");
            itemComponent.data = obj;
            itemComponent.setData();
            self.cMenhGia.content.addChild(item);
            return;
          }));
        }
      },
      NhaMang_clear: function NhaMang_clear() {
        this.cNhaMang.content.destroyAllChildren();
      },
      MenhGia_clear: function MenhGia_clear() {
        this.cMenhGia.content.destroyAllChildren();
      }
    });
    cc._RF.pop();
  }, {} ],
  Users_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d32bZeBdZI9agmlvPc5bzn", "Users_item");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        UID: cc.Label,
        username: cc.Label,
        namer: cc.Label,
        phone: cc.Label,
        red: cc.Label,
        xu: cc.Label,
        ket: cc.Label
      },
      onDisable: function onDisable() {
        this.reset();
      },
      showUpdate: function showUpdate() {
        cc.TT.dialog.openUsers(this);
      },
      setData: function setData() {
        this.UID.string = this.data.UID;
        this.username.string = this.data.username;
        this.namer.string = this.data.name;
        this.phone.string = this.data.phone;
        this.red.string = Helper.numberToBet(this.data.red);
        this.xu.string = Helper.numberToBet(this.data.xu);
        this.ket.string = Helper.numberToBet(this.data.ketSat);
      },
      reset: function reset() {
        this.data = null;
        this.UID.string = this.username.string = this.namer.string = this.phone.string = this.red.string = this.xu.string = this.ket.string = "";
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  Users: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c95928EnElJNLrQQ6nkxmwP", "Users");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        pagination: cc.Node,
        input: cc.EditBox,
        isFind: false
      },
      onLoad: function onLoad() {
        this.pagination = this.pagination.getComponent("Pagination");
        this.content2 = this.content.children.map(function(obj) {
          return obj.getComponent("Users_item");
        });
        this.pagination.init(this);
      },
      onEnable: function onEnable() {
        this.get_data();
      },
      onDisable: function onDisable() {
        this.isFind = false;
        this.input.string = "";
      },
      find: function find() {
        this.isFind = true;
        this.get_data();
      },
      cancelFind: function cancelFind() {
        this.isFind = false;
        this.get_data();
      },
      get_data: function get_data() {
        var page = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this.isFind ? Helper.isEmpty(this.input.string) ? cc.TT.notice.show("Vui l\xf2ng nh\u1eadp t\xean ng\u01b0\u1eddi d\xf9ng...", "TH\xd4NG TIN NG\u01af\u1edcI D\xd9NG") : cc.TT.post({
          users: {
            get_users: {
              find: this.input.string,
              page: page
            }
          }
        }) : cc.TT.post({
          users: {
            get_users: {
              page: page
            }
          }
        });
      },
      onData: function onData(data) {
        void 0 !== data.get_users && this.setData(data.get_users);
        if (void 0 !== data.update) {
          cc.TT.notice.show("Thay \u0111\u1ed5i th\xf4ng tin ng\u01b0\u1eddi d\xf9ng th\xe0nh c\xf4ng...", "TH\xd4NG TIN NG\u01af\u1edcI D\xd9NG");
          cc.TT.dialog.users.onEmitData(data.update);
        }
      },
      setData: function setData(data) {
        var self = this;
        this.pagination.onSet(data.page, data.kmess, data.total);
        this.content2.map(function(obj, i) {
          if (void 0 !== data.data[i]) {
            self.content.children[i].active = true;
            obj.data = data.data[i];
            obj.setData();
          } else self.content.children[i].active = false;
        });
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  backgroundDisable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "675e4Kt/a1GsqGjiT4KB/YD", "backgroundDisable");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onEnable: function onEnable() {
        this.node.on("touchstart", function(event) {
          event.stopPropagation();
        });
        this.node.on("touchend", function(event) {
          event.stopPropagation();
        });
      },
      onDisable: function onDisable() {
        this.node.off("touchstart", function(event) {
          event.stopPropagation();
        });
        this.node.off("touchend", function(event) {
          event.stopPropagation();
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  dialog_daily: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91275CV599DjrRwFbMZYBnr", "dialog_daily");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        nodeAdd: cc.Node,
        nodeRemove: cc.Node,
        nameD: cc.EditBox,
        nickname: cc.EditBox,
        phone: cc.EditBox,
        fb: cc.EditBox,
        noticeRemove: cc.Label
      },
      openAdd: function openAdd() {
        this.nodeAdd.active = true;
        this.nodeRemove.active = false;
      },
      openRemove: function openRemove(name, id) {
        this.idD = id;
        this.noticeRemove.string = "X\xe1c th\u1ef1c xo\xe1 \u0111\u1ea1i l\xfd: " + name;
        this.nodeAdd.active = false;
        this.nodeRemove.active = true;
      },
      onClickAdd: function onClickAdd() {
        if (Helper.isEmpty(this.nameD.string) || Helper.isEmpty(this.nickname.string) || Helper.isEmpty(this.phone.string) || Helper.isEmpty(this.fb.string)) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng c\xe1c th\xf4ng tin...", "\u0110\u1ea0I L\xdd");
          return;
        }
        cc.TT.post({
          shop: {
            daily: {
              add: {
                name: this.nameD.string,
                nickname: this.nickname.string,
                phone: this.phone.string,
                fb: this.fb.string
              }
            }
          }
        });
      },
      onClickRemove: function onClickRemove() {
        cc.TT.post({
          shop: {
            daily: {
              remove: this.idD
            }
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  dialog_giftcode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d39cJxuLdAv4CVdWghORXW", "dialog_giftcode");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        nodeAdd: cc.Node,
        nodeRemove: cc.Node,
        giftcode: cc.EditBox,
        red: cc.EditBox,
        xu: cc.EditBox,
        chung: cc.EditBox,
        ngay: cc.EditBox,
        thang: cc.EditBox,
        nam: cc.EditBox
      },
      showAdd: function showAdd() {
        this.nodeAdd.active = true;
        this.nodeRemove.active = false;
      },
      showRemove: function showRemove(id) {
        this.idD = id;
        this.nodeAdd.active = false;
        this.nodeRemove.active = true;
      },
      onClickCreate: function onClickCreate() {
        cc.TT.post({
          giftcode: {
            create_gift: true
          }
        });
      },
      onClickRemove: function onClickRemove() {
        cc.TT.post({
          giftcode: {
            remove: this.idD
          }
        });
      },
      onClickSave: function onClickSave() {
        if (Helper.isEmpty(this.giftcode.string) || Helper.isEmpty(this.red.string) && Helper.isEmpty(this.xu.string) || Helper.isEmpty(this.ngay.string) || Helper.isEmpty(this.thang.string) || Helper.isEmpty(this.nam.string)) cc.TT.notice.show("Ki\u1ec3m tra l\u1ea1i c\xe1c th\xf4ng tin...", "T\u1ea0O GIFTCODE"); else {
          var ngay = Math.abs(parseInt(this.ngay.string));
          var thang = Math.abs(parseInt(this.thang.string));
          var nam = Math.abs(parseInt(this.nam.string));
          isNaN(ngay) || isNaN(thang) || isNaN(nam) || ngay > 31 || thang > 12 ? cc.TT.notice.show("Ki\u1ec3m tra l\u1ea1i c\xe1c th\xf4ng tin...", "T\u1ea0O GIFTCODE") : cc.TT.post({
            giftcode: {
              save: {
                giftcode: this.giftcode.string,
                red: Helper.DotToNumber(this.red.string),
                xu: Helper.DotToNumber(this.xu.string),
                chung: this.chung.string,
                ngay: this.ngay.string,
                thang: this.thang.string,
                nam: this.nam.string
              }
            }
          });
        }
      },
      onChangerRed: function onChangerRed(value) {
        this.red.string = 0 == this.red.string ? "" : Helper.DotToBet(value);
      },
      onChangerXu: function onChangerXu(value) {
        this.xu.string = 0 == this.xu.string ? "" : Helper.DotToBet(value);
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  dialog_muathe_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c0ec5ysYJNOGLp4FwSSRYh1", "dialog_muathe_item");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        nhaMang: cc.Label,
        menhGia: cc.Label,
        maThe: cc.Label,
        seri: cc.Label,
        hetHan: cc.Label,
        editMaThe: cc.EditBox,
        editSeri: cc.EditBox,
        editHetHan: cc.EditBox
      },
      onDisable: function onDisable() {
        this.reset();
      },
      reset: function reset() {
        this.editMaThe.string = this.editSeri.string = this.editHetHan.string = "";
      },
      setData: function setData() {
        this.cardID = this.data._id;
        this.nhaMang.string = this.data.nhaMang;
        this.menhGia.string = this.data.menhGia;
        this.maThe.string = "M\xe3 th\u1ebb: " + this.data.maThe;
        this.seri.string = "Seri: " + this.data.seri;
        this.hetHan.string = "H\u1ebft h\u1ea1n: " + this.data.time;
      }
    });
    cc._RF.pop();
  }, {} ],
  dialog_muathe: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "422a5I+66xJh55NMQnzlLEx", "dialog_muathe");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node
      },
      init: function init() {
        this.objEdit = null;
        this.status = 1;
        this.content2 = this.content.children.map(function(obj) {
          return obj.getComponent("dialog_muathe_item");
        });
      },
      onEmitData: function onEmitData(data) {
        this.objEdit.data = data.cart;
        this.setData(data.cart._id, data.card);
        this.objEdit.setData();
      },
      setData: function setData(cart, card) {
        var self = this;
        this.cart = cart;
        this.card = card;
        this.content2.map(function(obj, i) {
          if (void 0 !== card[i]) {
            self.content.children[i].active = true;
            obj.data = card[i];
            obj.setData();
          } else self.content.children[i].active = false;
        });
      },
      changerStatus: function changerStatus(event, status) {
        this.status = status;
      },
      onChanger: function onChanger() {
        var self = this;
        var aTemp = Promise.all(this.card.map(function(obj, index) {
          obj.maThe = self.content2[index].editMaThe.string;
          obj.seri = self.content2[index].editSeri.string;
          obj.time = self.content2[index].editHetHan.string;
          return obj;
        }));
        aTemp.then(function(data) {
          cc.TT.post({
            mua_the: {
              set_data: {
                data: data,
                status: self.status,
                id: self.cart
              }
            }
          });
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  dialog_napthe: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "efd73ikvgFC/ruzZsy4MfLE", "dialog_napthe");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        time: cc.Label,
        username: cc.Label,
        nhaMang: cc.Label,
        menhGia: cc.Label,
        maThe: cc.Label,
        seri: cc.Label,
        status: cc.Label,
        nhan: cc.Label,
        setStatus: 1,
        editBox: cc.EditBox
      },
      onChangerStatus: function onChangerStatus(event, data) {
        this.setStatus = data;
      },
      setData: function setData(obj) {
        this.objData = obj;
        var data = obj.data;
        this.time.string = Helper.date("HH:mm dd/MM/yyyy", data.time);
        this.username.string = data.name;
        this.nhaMang.string = data.nhaMang;
        this.menhGia.string = data.menhGia;
        this.nhan.string = Helper.numberToBet(data.nhan);
        this.maThe.string = data.maThe;
        this.seri.string = data.seri;
        this.status.string = 0 == data.status ? "Ch\u1edd duy\u1ec7t" : 1 == data.status ? "N\u1ea1p th\xe0nh c\xf4ng" : 2 == data.status ? "N\u1ea1p th\u1ea5t b\u1ea1i" : "";
        this.status.node.color = 0 == data.status ? cc.color(45, 171, 255, 255) : 1 == data.status ? cc.color(0, 255, 71, 255) : 2 == data.status ? cc.color(255, 0, 0, 255) : cc.color(45, 171, 255, 255);
      },
      onEmitData: function onEmitData(data) {
        this.objData.data = data;
        this.time.string = this.objData.time.string = Helper.date("HH:mm dd/MM/yyyy", data.time);
        this.username.string = this.objData.username.string = data.name;
        this.nhaMang.string = this.objData.nhaMang.string = data.nhaMang;
        this.menhGia.string = this.objData.menhGia.string = data.menhGia;
        this.nhan.string = this.objData.nhan.string = Helper.numberToBet(data.nhan);
        this.maThe.string = this.objData.maThe.string = data.maThe;
        this.seri.string = this.objData.seri.string = data.seri;
        this.status.string = this.objData.status.string = 0 == data.status ? "Ch\u1edd duy\u1ec7t" : 1 == data.status ? "N\u1ea1p th\xe0nh c\xf4ng" : 2 == data.status ? "N\u1ea1p th\u1ea5t b\u1ea1i" : "";
        this.status.node.color = this.objData.status.node.color = 0 == data.status ? cc.color(45, 171, 255, 255) : 1 == data.status ? cc.color(0, 255, 71, 255) : 2 == data.status ? cc.color(255, 0, 0, 255) : cc.color(45, 171, 255, 255);
        cc.TT.notice.show("C\u1eadp nh\u1eadt th\xe0nh c\xf4ng...", "N\u1ea0P TH\u1eba");
        this.editBox.string = "";
      },
      onChangerInput: function onChangerInput(value) {
        this.editBox.string = 0 == this.editBox.string ? "" : Helper.DotToBet(value);
      },
      onClickSet: function onClickSet() {
        cc.TT.post({
          nap_the: {
            set_data: {
              id: this.objData.data._id,
              status: this.setStatus,
              nhan: Helper.DotToNumber(this.editBox.string)
            }
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  dialog_profile_pass: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3fbb9nwoztPbLdkUI5AsUr+", "dialog_profile_pass");
    "use strict";
    var Helper = require("Helper");
    var BrowserUtil = require("BrowserUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        password: cc.EditBox,
        newPassword: cc.EditBox,
        newPassword2: cc.EditBox
      },
      onLoad: function onLoad() {
        var self = this;
        this.editboxs = [ this.password, this.newPassword, this.newPassword2 ];
        this.keyHandle = function(t) {
          return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(), t.preventDefault && t.preventDefault(), 
          !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onClickChanger(), 
          t.preventDefault && t.preventDefault(), !1) : void 0;
        };
      },
      onEnable: function onEnable() {
        cc.sys.isBrowser && this.addEventTT();
      },
      onDisable: function onDisable() {
        cc.sys.isBrowser && this.removeEventTT();
        this.reset();
      },
      addEventTT: function addEventTT() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1);
      },
      removeEventTT: function removeEventTT() {
        for (var t in this.editboxs) BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.escape:
          this.isTop() && cc.TT.dialog.eventClickBgEnd();
          break;

         case cc.macro.KEY.tab:
          this.isTop() && this.changeNextFocusEditBox();
          break;

         case cc.macro.KEY.enter:
          this.isTop() && this.onClickChanger();
        }
      },
      changeNextFocusEditBox: function changeNextFocusEditBox() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++) if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
          i <= ++e && (e = 0), BrowserUtil.focusEditBox(this.editboxs[e]), t = !0;
          break;
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
      },
      isTop: function isTop() {
        return !cc.TT.notice.node.active && !cc.TT.loading.active;
      },
      onClickChanger: function onClickChanger() {
        if (Helper.isEmpty(this.password.string) || Helper.isEmpty(this.newPassword.string) || Helper.isEmpty(this.newPassword2.string)) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng c\xe1c th\xf4ng tin...", "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
          return;
        }
        if (this.password.string.length > 32 || this.password.string.length < 5 || this.newPassword.string.length > 32 || this.newPassword.string.length < 5 || this.newPassword2.string.length > 32 || this.newPassword2.string.length < 5) {
          cc.TT.notice.show("M\u1eadt kh\u1ea9u t\u1eeb 5 - 32 k\xed t\u1ef1.", "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
          return;
        }
        if (this.newPassword.string != this.newPassword2.string) {
          cc.TT.notice.show("M\u1eadt kh\u1ea9u m\u1edbi kh\xf4ng kh\u1edbp...", "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
          return;
        }
        cc.TT.loading.show();
        cc.TT.post({
          admin: {
            doi_pass: {
              password: this.password.string,
              newPassword: this.newPassword.string,
              newPassword2: this.newPassword2.string
            }
          }
        });
      },
      onData: function onData(data) {
        200 == data.status && this.reset();
        cc.TT.notice.show(data.text, "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
        cc.TT.loading.close();
      },
      reset: function reset() {
        this.password.string = this.newPassword.string = this.newPassword2.string = "";
      }
    });
    cc._RF.pop();
  }, {
    BrowserUtil: "BrowserUtil",
    Helper: "Helper"
  } ],
  dialog_profile: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d6b55mttf5OS5G6atAlHTVr", "dialog_profile");
    "use strict";
    var BrowserUtil = require("BrowserUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        adminInfo: cc.Node,
        doi_pass: cc.Node,
        username: cc.Label,
        rights: cc.Label
      },
      onLoad: function onLoad() {
        this.doi_pass = this.doi_pass.getComponent("dialog_profile_pass");
      },
      onDisable: function onDisable() {
        this.reset();
      },
      sceneChanger: function sceneChanger() {
        this.adminInfo.active = this.doi_pass.node.active;
        this.doi_pass.node.active = !this.doi_pass.node.active;
      },
      reset: function reset() {
        this.adminInfo.active = true;
        this.doi_pass.node.active = false;
      }
    });
    cc._RF.pop();
  }, {
    BrowserUtil: "BrowserUtil"
  } ],
  dialog_thecao: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "778df12pMBIrb102eIeKp1K", "dialog_thecao");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        nodeNhaMang: cc.Node,
        nodeMenhGia: cc.Node,
        nodeRNhaMang: cc.Node,
        nodeRMenhGia: cc.Node,
        labelRemoveNM: cc.Label,
        nhaMangEditBox: cc.EditBox,
        nhaMangToggle1: cc.Toggle,
        nhaMangToggle2: cc.Toggle,
        menhGiaEditBox1: cc.EditBox,
        menhGiaEditBox2: cc.EditBox,
        menhGiaToggle1: cc.Toggle,
        menhGiaToggle2: cc.Toggle
      },
      addNhaMang: function addNhaMang() {
        this.nodeNhaMang.active = true;
        this.nodeMenhGia.active = this.nodeRNhaMang.active = this.nodeRMenhGia.active = false;
      },
      addMenhGia: function addMenhGia() {
        this.nodeNhaMang.active = this.nodeRNhaMang.active = this.nodeRMenhGia.active = false;
        this.nodeMenhGia.active = true;
      },
      removeNhaMang: function removeNhaMang(id, name) {
        this.idD = id;
        this.nodeNhaMang.active = this.nodeMenhGia.active = this.nodeRMenhGia.active = false;
        this.nodeRNhaMang.active = true;
        this.labelRemoveNM.string = "X\xe1c nh\u1eadn xo\xe1 nh\xe0 m\u1ea1ng: " + name;
      },
      removeMenhGia: function removeMenhGia(id) {
        this.idD = id;
        this.nodeNhaMang.active = this.nodeMenhGia.active = this.nodeRNhaMang.active = false;
        this.nodeRMenhGia.active = true;
      },
      onClickANM: function onClickANM() {
        if (Helper.isEmpty(this.nhaMangEditBox.string) || !this.nhaMangToggle1.isChecked && !this.nhaMangToggle2.isChecked) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng c\xe1c th\xf4ng tin...", "TH\xcaM NH\xc0 M\u1ea0NG");
          return;
        }
        cc.TT.post({
          shop: {
            nhamang: {
              add: {
                name: this.nhaMangEditBox.string,
                nap: this.nhaMangToggle1.isChecked,
                mua: this.nhaMangToggle2.isChecked
              }
            }
          }
        });
      },
      onClickAMG: function onClickAMG() {
        if (Helper.isEmpty(this.menhGiaEditBox1.string) || Helper.isEmpty(this.menhGiaEditBox2.string) || !this.menhGiaToggle1.isChecked && !this.menhGiaToggle2.isChecked) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng c\xe1c th\xf4ng tin...", "TH\xcaM M\u1ec6NH GI\xc1");
          return;
        }
        cc.TT.post({
          shop: {
            menhgia: {
              add: {
                name: this.menhGiaEditBox1.string,
                values: Helper.DotToNumber(this.menhGiaEditBox2.string),
                nap: this.menhGiaToggle1.isChecked,
                mua: this.menhGiaToggle2.isChecked
              }
            }
          }
        });
      },
      onClickRNM: function onClickRNM() {
        cc.TT.post({
          shop: {
            nhamang: {
              remove: this.idD
            }
          }
        });
        cc.TT.dialog.close();
      },
      onClickRMG: function onClickRMG() {
        cc.TT.post({
          shop: {
            menhgia: {
              remove: this.idD
            }
          }
        });
        cc.TT.dialog.close();
      },
      onChangerInput1: function onChangerInput1(value) {
        this.menhGiaEditBox1.string = 0 == this.menhGiaEditBox1.string ? "" : Helper.DotToBet(value);
      },
      onChangerInput2: function onChangerInput2(value) {
        this.menhGiaEditBox2.string = 0 == this.menhGiaEditBox2.string ? "" : Helper.DotToBet(value);
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  dialog_users_update_pass: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f1624t8sFxI8L4LeAkvUidO", "dialog_users_update_pass");
    "use strict";
    var Helper = require("Helper");
    var BrowserUtil = require("BrowserUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        newPassword: cc.EditBox,
        newPassword2: cc.EditBox
      },
      init: function init(obj) {
        this.controller = obj;
      },
      onLoad: function onLoad() {
        var self = this;
        this.editboxs = [ this.newPassword, this.newPassword2 ];
        this.keyHandle = function(t) {
          return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(), t.preventDefault && t.preventDefault(), 
          !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onClickChanger(), 
          t.preventDefault && t.preventDefault(), !1) : void 0;
        };
      },
      onEnable: function onEnable() {
        cc.sys.isBrowser && this.addEventTT();
      },
      onDisable: function onDisable() {
        cc.sys.isBrowser && this.removeEventTT();
        this.reset();
      },
      addEventTT: function addEventTT() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1);
      },
      removeEventTT: function removeEventTT() {
        for (var t in this.editboxs) BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.tab:
          this.isTop() && this.changeNextFocusEditBox();
          break;

         case cc.macro.KEY.enter:
          this.isTop() && this.onClickChanger();
        }
      },
      changeNextFocusEditBox: function changeNextFocusEditBox() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++) if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
          i <= ++e && (e = 0), BrowserUtil.focusEditBox(this.editboxs[e]), t = !0;
          break;
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
      },
      isTop: function isTop() {
        return !cc.TT.notice.node.active && !cc.TT.loading.active;
      },
      onClickChanger: function onClickChanger() {
        if (Helper.isEmpty(this.newPassword.string) || Helper.isEmpty(this.newPassword2.string)) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng c\xe1c th\xf4ng tin...", "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
          return;
        }
        if (this.newPassword.string.length > 32 || this.newPassword.string.length < 5 || this.newPassword2.string.length > 32 || this.newPassword2.string.length < 5) {
          cc.TT.notice.show("M\u1eadt kh\u1ea9u t\u1eeb 5 - 32 k\xed t\u1ef1.", "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
          return;
        }
        if (this.newPassword.string != this.newPassword2.string) {
          cc.TT.notice.show("M\u1eadt kh\u1ea9u m\u1edbi kh\xf4ng kh\u1edbp...", "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
          return;
        }
        cc.TT.post({
          users: {
            updatePass: {
              id: this.controller.objEdit.data._id,
              newPassword: this.newPassword.string,
              newPassword2: this.newPassword2.string
            }
          }
        });
      },
      onData: function onData(data) {
        200 == data.status && this.reset();
        cc.TT.notice.show(data.text, "\u0110\u1ed4I M\u1eacT KH\u1ea8U");
        cc.TT.loading.close();
      },
      reset: function reset() {
        this.newPassword.string = this.newPassword2.string = "";
      }
    });
    cc._RF.pop();
  }, {
    BrowserUtil: "BrowserUtil",
    Helper: "Helper"
  } ],
  dialog_users_update_red: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ff1c1LT5kpOkJMj/BV+LJE/", "dialog_users_update_red");
    "use strict";
    var Helper = require("Helper");
    var BrowserUtil = require("BrowserUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        newRED: cc.EditBox
      },
      init: function init(obj) {
        this.controller = obj;
      },
      onLoad: function onLoad() {
        var self = this;
        this.keyHandle = function(t) {
          return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(), t.preventDefault && t.preventDefault(), 
          !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onClickChanger(), 
          t.preventDefault && t.preventDefault(), !1) : void 0;
        };
      },
      onEnable: function onEnable() {
        cc.sys.isBrowser && this.addEventTT();
      },
      onDisable: function onDisable() {
        cc.sys.isBrowser && this.removeEventTT();
        this.reset();
      },
      addEventTT: function addEventTT() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        BrowserUtil.getHTMLElementByEditBox(this.newRED).addEventListener("keydown", this.keyHandle, !1);
      },
      removeEventTT: function removeEventTT() {
        BrowserUtil.getHTMLElementByEditBox(this.newRED).removeEventListener("keydown", this.keyHandle, !1);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.tab:
          this.isTop() && this.changeNextFocusEditBox();
          break;

         case cc.macro.KEY.enter:
          this.isTop() && this.onClickChanger();
        }
      },
      changeNextFocusEditBox: function changeNextFocusEditBox() {
        BrowserUtil.focusEditBox(this.newRED);
      },
      isTop: function isTop() {
        return !cc.TT.notice.node.active && !cc.TT.loading.active;
      },
      onChangerInput: function onChangerInput(value) {
        this.newRED.string = Helper.DotToBet(value);
      },
      onClickChanger: function onClickChanger() {
        if (Helper.isEmpty(this.newRED.string)) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng th\xf4ng tin...", "C\u1eacP NH\u1eacT RED");
          return;
        }
        cc.TT.post({
          users: {
            updateRed: {
              id: this.controller.objEdit.data._id,
              newRED: Helper.DotToNumber(this.newRED.string)
            }
          }
        });
      },
      onData: function onData(data) {
        200 == data.status && this.reset();
        cc.TT.notice.show(data.text, "C\u1eacP NH\u1eacT RED");
        cc.TT.loading.close();
      },
      reset: function reset() {
        this.newRED.string = "";
      }
    });
    cc._RF.pop();
  }, {
    BrowserUtil: "BrowserUtil",
    Helper: "Helper"
  } ],
  dialog_users_update_xu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a030b8y8r9Ldomrladb4bSP", "dialog_users_update_xu");
    "use strict";
    var Helper = require("Helper");
    var BrowserUtil = require("BrowserUtil");
    cc.Class({
      extends: cc.Component,
      properties: {
        newXu: cc.EditBox
      },
      init: function init(obj) {
        this.controller = obj;
      },
      onLoad: function onLoad() {
        var self = this;
        this.keyHandle = function(t) {
          return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(), t.preventDefault && t.preventDefault(), 
          !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onClickChanger(), 
          t.preventDefault && t.preventDefault(), !1) : void 0;
        };
      },
      onEnable: function onEnable() {
        cc.sys.isBrowser && this.addEventTT();
      },
      onDisable: function onDisable() {
        cc.sys.isBrowser && this.removeEventTT();
        this.reset();
      },
      addEventTT: function addEventTT() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        BrowserUtil.getHTMLElementByEditBox(this.newXu).addEventListener("keydown", this.keyHandle, !1);
      },
      removeEventTT: function removeEventTT() {
        BrowserUtil.getHTMLElementByEditBox(this.newXu).removeEventListener("keydown", this.keyHandle, !1);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.tab:
          this.isTop() && this.changeNextFocusEditBox();
          break;

         case cc.macro.KEY.enter:
          this.isTop() && this.onClickChanger();
        }
      },
      changeNextFocusEditBox: function changeNextFocusEditBox() {
        BrowserUtil.focusEditBox(this.newXu);
      },
      isTop: function isTop() {
        return !cc.TT.notice.node.active && !cc.TT.loading.active;
      },
      onChangerInput: function onChangerInput(value) {
        this.newXu.string = Helper.DotToBet(value);
      },
      onClickChanger: function onClickChanger() {
        if (Helper.isEmpty(this.newXu.string)) {
          cc.TT.notice.show("Kh\xf4ng \u0111\u01b0\u1ee3c b\u1ecf tr\u1ed1ng th\xf4ng tin...", "C\u1eacP NH\u1eacT XU");
          return;
        }
        cc.TT.post({
          users: {
            updateXu: {
              id: this.controller.objEdit.data._id,
              newXu: Helper.DotToNumber(this.newXu.string)
            }
          }
        });
      },
      onData: function onData(data) {
        200 == data.status && this.reset();
        cc.TT.notice.show(data.text, "C\u1eacP NH\u1eacT XU");
        cc.TT.loading.close();
      },
      reset: function reset() {
        this.newXu.string = "";
      }
    });
    cc._RF.pop();
  }, {
    BrowserUtil: "BrowserUtil",
    Helper: "Helper"
  } ],
  dialog_users: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "32584Ac2/1Bo7lQX1CUizIy", "dialog_users");
    "use strict";
    var Helper = require("Helper");
    cc.Class({
      extends: cc.Component,
      properties: {
        username: cc.Label,
        namer: cc.Label,
        phone: cc.Label,
        red: cc.Label,
        xu: cc.Label,
        info: cc.Node,
        changerPass: cc.Node,
        changerRed: cc.Node,
        changerXu: cc.Node
      },
      onLoad: function onLoad() {
        this.sceneSelect = null;
        this.changerPass = this.changerPass.getComponent("dialog_users_update_pass");
        this.changerRed = this.changerRed.getComponent("dialog_users_update_red");
        this.changerXu = this.changerXu.getComponent("dialog_users_update_xu");
        this.changerPass.init(this);
        this.changerRed.init(this);
        this.changerXu.init(this);
      },
      onDisable: function onDisable() {
        this.reset();
      },
      scenePass: function scenePass(event) {
        this.sceneSelect = this.changerPass.node;
        this.sceneSelect.active = true;
        this.info.active = false;
      },
      sceneRed: function sceneRed(event) {
        this.sceneSelect = this.changerRed.node;
        this.sceneSelect.active = true;
        this.info.active = false;
      },
      sceneXu: function sceneXu(event) {
        console.log(event);
        this.sceneSelect = this.changerXu.node;
        this.sceneSelect.active = true;
        this.info.active = false;
      },
      backScene: function backScene(event) {
        this.sceneSelect.active = false;
        this.info.active = true;
      },
      setData: function setData(data) {
        this.username.string = data.username;
        this.namer.string = data.name;
        this.phone.string = data.phone;
        this.red.string = Helper.numberToBet(data.red);
        this.xu.string = Helper.numberToBet(data.xu);
      },
      setObj: function setObj(obj) {
        this.objEdit = obj;
        this.setData(obj.data);
      },
      onEmitData: function onEmitData(data) {
        this.objEdit.data = data;
        this.objEdit.setData();
        this.setData(data);
      },
      reset: function reset() {
        this.info.active = true;
        this.sceneSelect = null;
        this.data = null;
        this.changerPass.node.active = this.changerRed.node.active = this.changerXu.node.active = false;
      }
    });
    cc._RF.pop();
  }, {
    Helper: "Helper"
  } ],
  dialog: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a604dFxQsVP6InhPmXar4BP", "dialog");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        profile: cc.Node,
        napthe: cc.Node,
        muathe: cc.Node,
        users: cc.Node,
        daily: cc.Node,
        thecao: cc.Node,
        giftcode: cc.Node
      },
      init: function init() {
        this.dialog = null;
        this.profile = this.profile.getComponent("dialog_profile");
        this.napthe = this.napthe.getComponent("dialog_napthe");
        this.muathe = this.muathe.getComponent("dialog_muathe");
        this.users = this.users.getComponent("dialog_users");
        this.daily = this.daily.getComponent("dialog_daily");
        this.thecao = this.thecao.getComponent("dialog_thecao");
        this.giftcode = this.giftcode.getComponent("dialog_giftcode");
        this.muathe.init();
      },
      close: function close() {
        if (null !== this.dialog) {
          this.node.active = false;
          this.dialog.node.active = false;
          this.dialog = null;
        }
      },
      openProfile: function openProfile() {
        this.node.active = true;
        this.dialog = this.profile;
        this.profile.node.active = true;
      },
      openNapThe: function openNapThe(data) {
        this.node.active = true;
        this.dialog = this.napthe;
        this.napthe.node.active = true;
        this.napthe.setData(data);
      },
      openMuaThe: function openMuaThe(cart, card, obj) {
        this.node.active = true;
        this.dialog = this.muathe;
        this.muathe.node.active = true;
        this.muathe.objEdit = obj;
        this.muathe.setData(cart, card, obj);
      },
      openUsers: function openUsers(obj) {
        this.node.active = true;
        this.dialog = this.users;
        this.users.node.active = true;
        this.users.setObj(obj);
      },
      openDaily: function openDaily() {
        this.node.active = true;
        this.dialog = this.daily;
        this.daily.node.active = true;
        this.daily.openAdd();
      },
      dailyRemove: function dailyRemove(name, id) {
        this.node.active = true;
        this.dialog = this.daily;
        this.daily.node.active = true;
        this.daily.openRemove(name, id);
      },
      thecaoANM: function thecaoANM() {
        this.node.active = true;
        this.dialog = this.thecao;
        this.thecao.node.active = true;
        this.thecao.addNhaMang();
      },
      thecaoAMG: function thecaoAMG() {
        this.node.active = true;
        this.dialog = this.thecao;
        this.thecao.node.active = true;
        this.thecao.addMenhGia();
      },
      thecaoRNM: function thecaoRNM(id, name) {
        this.node.active = true;
        this.dialog = this.thecao;
        this.thecao.node.active = true;
        this.thecao.removeNhaMang(id, name);
      },
      thecaoRMG: function thecaoRMG(id) {
        this.node.active = true;
        this.dialog = this.thecao;
        this.thecao.node.active = true;
        this.thecao.removeMenhGia(id);
      },
      giftcodeAdd: function giftcodeAdd() {
        this.node.active = true;
        this.dialog = this.giftcode;
        this.giftcode.node.active = true;
        this.giftcode.showAdd();
      },
      giftcodeRemove: function giftcodeRemove(id) {
        this.node.active = true;
        this.dialog = this.giftcode;
        this.giftcode.node.active = true;
        this.giftcode.showRemove(id);
      }
    });
    cc._RF.pop();
  }, {} ],
  hoverScale: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "df2baQZi5xPPKYdn6l7lFIx", "hoverScale");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        pressedScale: 1,
        transDuration: 0
      },
      onLoad: function onLoad() {
        this.initScale = this.node.scale;
        this.scaleOnAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.scaleOffAction = cc.scaleTo(this.transDuration, this.initScale);
        this.eventOnHover = function(e) {
          this.node.stopAllActions();
          this.node.runAction(this.scaleOnAction);
        };
        this.eventOffHover = function(e) {
          this.node.stopAllActions();
          this.node.runAction(this.scaleOffAction);
        };
      },
      onEnable: function onEnable() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
      },
      onDisable: function onDisable() {
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
      }
    });
    cc._RF.pop();
  }, {} ],
  item_daily: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8f6210KMeVDMYYlKoE/3igM", "item_daily");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        stt: cc.Label,
        nameT: cc.Label,
        username: cc.Label,
        phone: cc.Label,
        fb: cc.Label
      },
      remove: function remove() {
        cc.TT.dialog.dailyRemove(this.nameT.string, this.idD);
      }
    });
    cc._RF.pop();
  }, {} ],
  panel_body: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c60a46XC5NIUZhw2mDsY/0h", "panel_body");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        TaiXiu: cc.Node,
        NapThe: cc.Node,
        MuaThe: cc.Node,
        Users: cc.Node,
        DaiLy: cc.Node,
        TheCao: cc.Node,
        GiftCode: cc.Node
      },
      init: function init() {
        this.TaiXiu = this.TaiXiu.getComponent("TaiXiu");
        this.NapThe = this.NapThe.getComponent("NapThe");
        this.MuaThe = this.MuaThe.getComponent("MuaThe");
        this.Users = this.Users.getComponent("Users");
        this.DaiLy = this.DaiLy.getComponent("DaiLy");
        this.TheCao = this.TheCao.getComponent("TheCao");
        this.GiftCode = this.GiftCode.getComponent("GiftCode");
        this.TaiXiu.init();
      }
    });
    cc._RF.pop();
  }, {} ],
  panel_let_menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cd51fVCTItI4ZXPGW9S42Vw", "panel_let_menu");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        username: cc.Label,
        rights: cc.Label,
        menu: cc.Node,
        toggleIcon: cc.Node
      },
      onLoad: function onLoad() {
        this.toggleShow = false;
        this.toggleRuning = false;
        this.menu = this.menu.getComponent("panel_menu");
      },
      toggle: function toggle() {
        if (!this.toggleRuning) {
          this.toggleRuning = true;
          this.toggleIcon.stopAllActions();
          this.node.stopAllActions();
          if (this.toggleShow) {
            this.node.runAction(cc.moveTo(.3, cc.v2(this.node.position.x - 330, 0)));
            this.toggleIcon.runAction(cc.sequence(cc.scaleTo(.3, -1, 1), cc.callFunc(function() {
              this.toggleRuning = this.toggleShow = false;
            }, this)));
          } else {
            this.toggleShow = true;
            this.node.runAction(cc.moveTo(.3, cc.v2(this.node.position.x + 330, 0)));
            this.toggleIcon.runAction(cc.sequence(cc.scaleTo(.3, 1, 1), cc.callFunc(function() {
              this.toggleRuning = false;
            }, this)));
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  panel_menu_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08979zWQshKdaK7NsZYI+rJ", "panel_menu_item");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        bg: cc.Node
      }
    });
    cc._RF.pop();
  }, {} ],
  panel_menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "993a45bwthAopmwAtQGreYb", "panel_menu");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node
      },
      onLoad: function onLoad() {
        var self = this;
        Promise.all(this.content.children.map(function(obj) {
          return obj.getComponent("panel_menu_item");
        })).then(function(values) {
          self.content = values;
        });
      },
      onClickMenu: function onClickMenu(event) {
        var obj = event.target;
        Promise.all(this.content.map(function(o) {
          if (o.node.name == obj.name) {
            o.bg.active = true;
            o.content.active = true;
            o.node.pauseSystemEvents();
          } else {
            o.bg.active = false;
            o.content.active = false;
            o.node.resumeSystemEvents();
          }
          return;
        }));
      }
    });
    cc._RF.pop();
  }, {} ],
  panel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a25432jbPRHfprAQ+0LWkp9", "panel");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        let_menu: cc.Node,
        body: cc.Node
      },
      init: function init() {
        this.let_menu = this.let_menu.getComponent("panel_let_menu");
        this.body = this.body.getComponent("panel_body");
        this.body.init();
      }
    });
    cc._RF.pop();
  }, {} ],
  "socket.io": [ function(require, module, exports) {
    (function(Buffer) {
      "use strict";
      cc._RF.push(module, "430a3kswTFArazhZ0ILdiRx", "socket.io");
      "use strict";
      var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      !function(t, e) {
        "object" == ("undefined" === typeof exports ? "undefined" : _typeof(exports)) && "object" == ("undefined" === typeof module ? "undefined" : _typeof(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == ("undefined" === typeof exports ? "undefined" : _typeof(exports)) ? exports.io = e() : t.io = e();
      }(void 0, function() {
        return function(t) {
          function e(r) {
            if (n[r]) return n[r].exports;
            var o = n[r] = {
              exports: {},
              id: r,
              loaded: !1
            };
            return t[r].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports;
          }
          var n = {};
          return e.m = t, e.c = n, e.p = "", e(0);
        }([ function(t, e, n) {
          function r(t, e) {
            "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), 
            e = e || {};
            var n, r = i(t), s = r.source, u = r.id, h = r.path, f = p[u] && h in p[u].nsps, l = e.forceNew || e["force new connection"] || !1 === e.multiplex || f;
            return l ? (c("ignoring socket cache for %s", s), n = a(s, e)) : (p[u] || (c("new io instance for %s", s), 
            p[u] = a(s, e)), n = p[u]), r.query && !e.query && (e.query = r.query), n.socket(r.path, e);
          }
          var o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          }, i = n(1), s = n(7), a = n(12), c = n(3)("socket.io-client");
          t.exports = e = r;
          var p = e.managers = {};
          e.protocol = s.protocol, e.connect = r, e.Manager = n(12), e.Socket = n(36);
        }, function(t, e, n) {
          function r(t, e) {
            var n = t;
            e = e || "undefined" != typeof location && location, null == t && (t = e.protocol + "//" + e.host), 
            "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? e.protocol + t : e.host + t), 
            /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t), t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t), 
            i("parse %s", t), n = o(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), 
            n.path = n.path || "/";
            var r = -1 !== n.host.indexOf(":"), s = r ? "[" + n.host + "]" : n.host;
            return n.id = n.protocol + "://" + s + ":" + n.port, n.href = n.protocol + "://" + s + (e && e.port === n.port ? "" : ":" + n.port), 
            n;
          }
          var o = n(2), i = n(3)("socket.io-client:url");
          t.exports = r;
        }, function(t, e) {
          var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, r = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
          t.exports = function(t) {
            var e = t, o = t.indexOf("["), i = t.indexOf("]");
            -1 != o && -1 != i && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));
            for (var s = n.exec(t || ""), a = {}, c = 14; c--; ) a[r[c]] = s[c] || "";
            return -1 != o && -1 != i && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), 
            a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), 
            a.ipv6uri = !0), a;
          };
        }, function(t, e, n) {
          (function(r) {
            function o() {
              return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type) || ("undefined" == typeof navigator || !navigator.userAgent || !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
            }
            function i(t) {
              var n = this.useColors;
              if (t[0] = (n ? "%c" : "") + this.namespace + (n ? " %c" : " ") + t[0] + (n ? "%c " : " ") + "+" + e.humanize(this.diff), 
              n) {
                var r = "color: " + this.color;
                t.splice(1, 0, r, "color: inherit");
                var o = 0, i = 0;
                t[0].replace(/%[a-zA-Z%]/g, function(t) {
                  "%%" !== t && (o++, "%c" === t && (i = o));
                }), t.splice(i, 0, r);
              }
            }
            function s() {
              return "object" == ("undefined" === typeof console ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
            }
            function a(t) {
              try {
                null == t ? e.storage.removeItem("debug") : e.storage.debug = t;
              } catch (n) {}
            }
            function c() {
              var t;
              try {
                t = e.storage.debug;
              } catch (n) {}
              return !t && "undefined" != typeof r && "env" in r && (t = r.env.DEBUG), t;
            }
            function p() {
              try {
                return window.localStorage;
              } catch (t) {}
            }
            e = t.exports = n(5), e.log = s, e.formatArgs = i, e.save = a, e.load = c, e.useColors = o, 
            e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : p(), 
            e.colors = [ "#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33" ], 
            e.formatters.j = function(t) {
              try {
                return JSON.stringify(t);
              } catch (e) {
                return "[UnexpectedJSONParseError]: " + e.message;
              }
            }, e.enable(c());
          }).call(e, n(4));
        }, function(t, e) {
          function n() {
            throw new Error("setTimeout has not been defined");
          }
          function r() {
            throw new Error("clearTimeout has not been defined");
          }
          function o(t) {
            if (u === setTimeout) return setTimeout(t, 0);
            if ((u === n || !u) && setTimeout) return u = setTimeout, setTimeout(t, 0);
            try {
              return u(t, 0);
            } catch (e) {
              try {
                return u.call(null, t, 0);
              } catch (e) {
                return u.call(this, t, 0);
              }
            }
          }
          function i(t) {
            if (h === clearTimeout) return clearTimeout(t);
            if ((h === r || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);
            try {
              return h(t);
            } catch (e) {
              try {
                return h.call(null, t);
              } catch (e) {
                return h.call(this, t);
              }
            }
          }
          function s() {
            y && l && (y = !1, l.length ? d = l.concat(d) : m = -1, d.length && a());
          }
          function a() {
            if (!y) {
              var t = o(s);
              y = !0;
              for (var e = d.length; e; ) {
                for (l = d, d = []; ++m < e; ) l && l[m].run();
                m = -1, e = d.length;
              }
              l = null, y = !1, i(t);
            }
          }
          function c(t, e) {
            this.fun = t, this.array = e;
          }
          function p() {}
          var u, h, f = t.exports = {};
          !function() {
            try {
              u = "function" == typeof setTimeout ? setTimeout : n;
            } catch (t) {
              u = n;
            }
            try {
              h = "function" == typeof clearTimeout ? clearTimeout : r;
            } catch (t) {
              h = r;
            }
          }();
          var l, d = [], y = !1, m = -1;
          f.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            d.push(new c(t, e)), 1 !== d.length || y || o(a);
          }, c.prototype.run = function() {
            this.fun.apply(null, this.array);
          }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", 
          f.versions = {}, f.on = p, f.addListener = p, f.once = p, f.off = p, f.removeListener = p, 
          f.removeAllListeners = p, f.emit = p, f.prependListener = p, f.prependOnceListener = p, 
          f.listeners = function(t) {
            return [];
          }, f.binding = function(t) {
            throw new Error("process.binding is not supported");
          }, f.cwd = function() {
            return "/";
          }, f.chdir = function(t) {
            throw new Error("process.chdir is not supported");
          }, f.umask = function() {
            return 0;
          };
        }, function(t, e, n) {
          function r(t) {
            var n, r = 0;
            for (n in t) r = (r << 5) - r + t.charCodeAt(n), r |= 0;
            return e.colors[Math.abs(r) % e.colors.length];
          }
          function o(t) {
            function n() {
              if (n.enabled) {
                var t = n, r = +new Date(), i = r - (o || r);
                t.diff = i, t.prev = o, t.curr = r, o = r;
                for (var s = new Array(arguments.length), a = 0; a < s.length; a++) s[a] = arguments[a];
                s[0] = e.coerce(s[0]), "string" != typeof s[0] && s.unshift("%O");
                var c = 0;
                s[0] = s[0].replace(/%([a-zA-Z%])/g, function(n, r) {
                  if ("%%" === n) return n;
                  c++;
                  var o = e.formatters[r];
                  if ("function" == typeof o) {
                    var i = s[c];
                    n = o.call(t, i), s.splice(c, 1), c--;
                  }
                  return n;
                }), e.formatArgs.call(t, s);
                var p = n.log || e.log || console.log.bind(console);
                p.apply(t, s);
              }
            }
            var o;
            return n.namespace = t, n.enabled = e.enabled(t), n.useColors = e.useColors(), n.color = r(t), 
            n.destroy = i, "function" == typeof e.init && e.init(n), e.instances.push(n), n;
          }
          function i() {
            var t = e.instances.indexOf(this);
            return -1 !== t && (e.instances.splice(t, 1), !0);
          }
          function s(t) {
            e.save(t), e.names = [], e.skips = [];
            var n, r = ("string" == typeof t ? t : "").split(/[\s,]+/), o = r.length;
            for (n = 0; n < o; n++) r[n] && (t = r[n].replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")));
            for (n = 0; n < e.instances.length; n++) {
              var i = e.instances[n];
              i.enabled = e.enabled(i.namespace);
            }
          }
          function a() {
            e.enable("");
          }
          function c(t) {
            if ("*" === t[t.length - 1]) return !0;
            var n, r;
            for (n = 0, r = e.skips.length; n < r; n++) if (e.skips[n].test(t)) return !1;
            for (n = 0, r = e.names.length; n < r; n++) if (e.names[n].test(t)) return !0;
            return !1;
          }
          function p(t) {
            return t instanceof Error ? t.stack || t.message : t;
          }
          e = t.exports = o.debug = o["default"] = o, e.coerce = p, e.disable = a, e.enable = s, 
          e.enabled = c, e.humanize = n(6), e.instances = [], e.names = [], e.skips = [], 
          e.formatters = {};
        }, function(t, e) {
          function n(t) {
            if (t = String(t), !(t.length > 100)) {
              var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
              if (e) {
                var n = parseFloat(e[1]), r = (e[2] || "ms").toLowerCase();
                switch (r) {
                 case "years":
                 case "year":
                 case "yrs":
                 case "yr":
                 case "y":
                  return n * u;

                 case "days":
                 case "day":
                 case "d":
                  return n * p;

                 case "hours":
                 case "hour":
                 case "hrs":
                 case "hr":
                 case "h":
                  return n * c;

                 case "minutes":
                 case "minute":
                 case "mins":
                 case "min":
                 case "m":
                  return n * a;

                 case "seconds":
                 case "second":
                 case "secs":
                 case "sec":
                 case "s":
                  return n * s;

                 case "milliseconds":
                 case "millisecond":
                 case "msecs":
                 case "msec":
                 case "ms":
                  return n;

                 default:
                  return;
                }
              }
            }
          }
          function r(t) {
            return t >= p ? Math.round(t / p) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms";
          }
          function o(t) {
            return i(t, p, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms";
          }
          function i(t, e, n) {
            if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s";
          }
          var s = 1e3, a = 60 * s, c = 60 * a, p = 24 * c, u = 365.25 * p;
          t.exports = function(t, e) {
            e = e || {};
            var i = "undefined" === typeof t ? "undefined" : _typeof(t);
            if ("string" === i && t.length > 0) return n(t);
            if ("number" === i && !1 === isNaN(t)) return e["long"] ? o(t) : r(t);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t));
          };
        }, function(t, e, n) {
          function r() {}
          function o(t) {
            var n = "" + t.type;
            if (e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (n += t.attachments + "-"), 
            t.nsp && "/" !== t.nsp && (n += t.nsp + ","), null != t.id && (n += t.id), null != t.data) {
              var r = i(t.data);
              if (!1 === r) return g;
              n += r;
            }
            return f("encoded %j as %s", t, n), n;
          }
          function i(t) {
            try {
              return JSON.stringify(t);
            } catch (e) {
              return !1;
            }
          }
          function s(t, e) {
            function n(t) {
              var n = d.deconstructPacket(t), r = o(n.packet), i = n.buffers;
              i.unshift(r), e(i);
            }
            d.removeBlobs(t, n);
          }
          function a() {
            this.reconstructor = null;
          }
          function c(t) {
            var n = 0, r = {
              type: Number(t.charAt(0))
            };
            if (null == e.types[r.type]) return h("unknown packet type " + r.type);
            if (e.BINARY_EVENT === r.type || e.BINARY_ACK === r.type) {
              for (var o = ""; "-" !== t.charAt(++n) && (o += t.charAt(n), n != t.length); ) ;
              if (o != Number(o) || "-" !== t.charAt(n)) throw new Error("Illegal attachments");
              r.attachments = Number(o);
            }
            if ("/" === t.charAt(n + 1)) for (r.nsp = ""; ++n; ) {
              var i = t.charAt(n);
              if ("," === i) break;
              if (r.nsp += i, n === t.length) break;
            } else r.nsp = "/";
            var s = t.charAt(n + 1);
            if ("" !== s && Number(s) == s) {
              for (r.id = ""; ++n; ) {
                var i = t.charAt(n);
                if (null == i || Number(i) != i) {
                  --n;
                  break;
                }
                if (r.id += t.charAt(n), n === t.length) break;
              }
              r.id = Number(r.id);
            }
            if (t.charAt(++n)) {
              var a = p(t.substr(n)), c = !1 !== a && (r.type === e.ERROR || y(a));
              if (!c) return h("invalid payload");
              r.data = a;
            }
            return f("decoded %s as %j", t, r), r;
          }
          function p(t) {
            try {
              return JSON.parse(t);
            } catch (e) {
              return !1;
            }
          }
          function u(t) {
            this.reconPack = t, this.buffers = [];
          }
          function h(t) {
            return {
              type: e.ERROR,
              data: "parser error: " + t
            };
          }
          var f = n(3)("socket.io-parser"), l = n(8), d = n(9), y = n(10), m = n(11);
          e.protocol = 4, e.types = [ "CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK" ], 
          e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, 
          e.BINARY_ACK = 6, e.Encoder = r, e.Decoder = a;
          var g = e.ERROR + '"encode error"';
          r.prototype.encode = function(t, n) {
            if (f("encoding packet %j", t), e.BINARY_EVENT === t.type || e.BINARY_ACK === t.type) s(t, n); else {
              var r = o(t);
              n([ r ]);
            }
          }, l(a.prototype), a.prototype.add = function(t) {
            var n;
            if ("string" == typeof t) n = c(t), e.BINARY_EVENT === n.type || e.BINARY_ACK === n.type ? (this.reconstructor = new u(n), 
            0 === this.reconstructor.reconPack.attachments && this.emit("decoded", n)) : this.emit("decoded", n); else {
              if (!m(t) && !t.base64) throw new Error("Unknown type: " + t);
              if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
              n = this.reconstructor.takeBinaryData(t), n && (this.reconstructor = null, this.emit("decoded", n));
            }
          }, a.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction();
          }, u.prototype.takeBinaryData = function(t) {
            if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
              var e = d.reconstructPacket(this.reconPack, this.buffers);
              return this.finishedReconstruction(), e;
            }
            return null;
          }, u.prototype.finishedReconstruction = function() {
            this.reconPack = null, this.buffers = [];
          };
        }, function(t, e, n) {
          function r(t) {
            if (t) return o(t);
          }
          function o(t) {
            for (var e in r.prototype) t[e] = r.prototype[e];
            return t;
          }
          t.exports = r, r.prototype.on = r.prototype.addEventListener = function(t, e) {
            return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), 
            this;
          }, r.prototype.once = function(t, e) {
            function n() {
              this.off(t, n), e.apply(this, arguments);
            }
            return n.fn = e, this.on(t, n), this;
          }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function(t, e) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, 
            this;
            var n = this._callbacks["$" + t];
            if (!n) return this;
            if (1 == arguments.length) return delete this._callbacks["$" + t], this;
            for (var r, o = 0; o < n.length; o++) if (r = n[o], r === e || r.fn === e) {
              n.splice(o, 1);
              break;
            }
            return this;
          }, r.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1), n = this._callbacks["$" + t];
            if (n) {
              n = n.slice(0);
              for (var r = 0, o = n.length; r < o; ++r) n[r].apply(this, e);
            }
            return this;
          }, r.prototype.listeners = function(t) {
            return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
          }, r.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length;
          };
        }, function(t, e, n) {
          function r(t, e) {
            if (!t) return t;
            if (s(t)) {
              var n = {
                _placeholder: !0,
                num: e.length
              };
              return e.push(t), n;
            }
            if (i(t)) {
              for (var o = new Array(t.length), a = 0; a < t.length; a++) o[a] = r(t[a], e);
              return o;
            }
            if ("object" == ("undefined" === typeof t ? "undefined" : _typeof(t)) && !(t instanceof Date)) {
              var o = {};
              for (var c in t) o[c] = r(t[c], e);
              return o;
            }
            return t;
          }
          function o(t, e) {
            if (!t) return t;
            if (t && t._placeholder) return e[t.num];
            if (i(t)) for (var n = 0; n < t.length; n++) t[n] = o(t[n], e); else if ("object" == ("undefined" === typeof t ? "undefined" : _typeof(t))) for (var r in t) t[r] = o(t[r], e);
            return t;
          }
          var i = n(10), s = n(11), a = Object.prototype.toString, c = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === a.call(Blob), p = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === a.call(File);
          e.deconstructPacket = function(t) {
            var e = [], n = t.data, o = t;
            return o.data = r(n, e), o.attachments = e.length, {
              packet: o,
              buffers: e
            };
          }, e.reconstructPacket = function(t, e) {
            return t.data = o(t.data, e), t.attachments = void 0, t;
          }, e.removeBlobs = function(t, e) {
            function n(t, a, u) {
              if (!t) return t;
              if (c && t instanceof Blob || p && t instanceof File) {
                r++;
                var h = new FileReader();
                h.onload = function() {
                  u ? u[a] = this.result : o = this.result, --r || e(o);
                }, h.readAsArrayBuffer(t);
              } else if (i(t)) for (var f = 0; f < t.length; f++) n(t[f], f, t); else if ("object" == ("undefined" === typeof t ? "undefined" : _typeof(t)) && !s(t)) for (var l in t) n(t[l], l, t);
            }
            var r = 0, o = t;
            n(o), r || e(o);
          };
        }, function(t, e) {
          var n = {}.toString;
          t.exports = Array.isArray || function(t) {
            return "[object Array]" == n.call(t);
          };
        }, function(t, e) {
          function n(t) {
            return r && Buffer.isBuffer(t) || o && (t instanceof ArrayBuffer || i(t));
          }
          t.exports = n;
          var r = "function" == typeof Buffer && "function" == typeof Buffer.isBuffer, o = "function" == typeof ArrayBuffer, i = function i(t) {
            return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer;
          };
        }, function(t, e, n) {
          function r(t, e) {
            if (!(this instanceof r)) return new r(t, e);
            t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), 
            e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, 
            this.reconnection(!1 !== e.reconnection), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), 
            this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), 
            this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new l({
              min: this.reconnectionDelay(),
              max: this.reconnectionDelayMax(),
              jitter: this.randomizationFactor()
            }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", 
            this.uri = t, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [];
            var n = e.parser || c;
            this.encoder = new n.Encoder(), this.decoder = new n.Decoder(), this.autoConnect = !1 !== e.autoConnect, 
            this.autoConnect && this.open();
          }
          var o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          }, i = n(13), s = n(36), a = n(8), c = n(7), p = n(38), u = n(39), h = n(3)("socket.io-client:manager"), f = n(35), l = n(40), d = Object.prototype.hasOwnProperty;
          t.exports = r, r.prototype.emitAll = function() {
            this.emit.apply(this, arguments);
            for (var t in this.nsps) d.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments);
          }, r.prototype.updateSocketIds = function() {
            for (var t in this.nsps) d.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t));
          }, r.prototype.generateId = function(t) {
            return ("/" === t ? "" : t + "#") + this.engine.id;
          }, a(r.prototype), r.prototype.reconnection = function(t) {
            return arguments.length ? (this._reconnection = !!t, this) : this._reconnection;
          }, r.prototype.reconnectionAttempts = function(t) {
            return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts;
          }, r.prototype.reconnectionDelay = function(t) {
            return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), 
            this) : this._reconnectionDelay;
          }, r.prototype.randomizationFactor = function(t) {
            return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), 
            this) : this._randomizationFactor;
          }, r.prototype.reconnectionDelayMax = function(t) {
            return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), 
            this) : this._reconnectionDelayMax;
          }, r.prototype.timeout = function(t) {
            return arguments.length ? (this._timeout = t, this) : this._timeout;
          }, r.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
          }, r.prototype.open = r.prototype.connect = function(t, e) {
            if (h("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
            h("opening %s", this.uri), this.engine = i(this.uri, this.opts);
            var n = this.engine, r = this;
            this.readyState = "opening", this.skipReconnect = !1;
            var o = p(n, "open", function() {
              r.onopen(), t && t();
            }), s = p(n, "error", function(e) {
              if (h("connect_error"), r.cleanup(), r.readyState = "closed", r.emitAll("connect_error", e), 
              t) {
                var n = new Error("Connection error");
                n.data = e, t(n);
              } else r.maybeReconnectOnOpen();
            });
            if (!1 !== this._timeout) {
              var a = this._timeout;
              h("connect attempt will timeout after %d", a);
              var c = setTimeout(function() {
                h("connect attempt timed out after %d", a), o.destroy(), n.close(), n.emit("error", "timeout"), 
                r.emitAll("connect_timeout", a);
              }, a);
              this.subs.push({
                destroy: function destroy() {
                  clearTimeout(c);
                }
              });
            }
            return this.subs.push(o), this.subs.push(s), this;
          }, r.prototype.onopen = function() {
            h("open"), this.cleanup(), this.readyState = "open", this.emit("open");
            var t = this.engine;
            this.subs.push(p(t, "data", u(this, "ondata"))), this.subs.push(p(t, "ping", u(this, "onping"))), 
            this.subs.push(p(t, "pong", u(this, "onpong"))), this.subs.push(p(t, "error", u(this, "onerror"))), 
            this.subs.push(p(t, "close", u(this, "onclose"))), this.subs.push(p(this.decoder, "decoded", u(this, "ondecoded")));
          }, r.prototype.onping = function() {
            this.lastPing = new Date(), this.emitAll("ping");
          }, r.prototype.onpong = function() {
            this.emitAll("pong", new Date() - this.lastPing);
          }, r.prototype.ondata = function(t) {
            this.decoder.add(t);
          }, r.prototype.ondecoded = function(t) {
            this.emit("packet", t);
          }, r.prototype.onerror = function(t) {
            h("error", t), this.emitAll("error", t);
          }, r.prototype.socket = function(t, e) {
            function n() {
              ~f(o.connecting, r) || o.connecting.push(r);
            }
            var r = this.nsps[t];
            if (!r) {
              r = new s(this, t, e), this.nsps[t] = r;
              var o = this;
              r.on("connecting", n), r.on("connect", function() {
                r.id = o.generateId(t);
              }), this.autoConnect && n();
            }
            return r;
          }, r.prototype.destroy = function(t) {
            var e = f(this.connecting, t);
            ~e && this.connecting.splice(e, 1), this.connecting.length || this.close();
          }, r.prototype.packet = function(t) {
            h("writing packet %j", t);
            var e = this;
            t.query && 0 === t.type && (t.nsp += "?" + t.query), e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, 
            this.encoder.encode(t, function(n) {
              for (var r = 0; r < n.length; r++) e.engine.write(n[r], t.options);
              e.encoding = !1, e.processPacketQueue();
            }));
          }, r.prototype.processPacketQueue = function() {
            if (this.packetBuffer.length > 0 && !this.encoding) {
              var t = this.packetBuffer.shift();
              this.packet(t);
            }
          }, r.prototype.cleanup = function() {
            h("cleanup");
            for (var t = this.subs.length, e = 0; e < t; e++) {
              var n = this.subs.shift();
              n.destroy();
            }
            this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy();
          }, r.prototype.close = r.prototype.disconnect = function() {
            h("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), 
            this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close();
          }, r.prototype.onclose = function(t) {
            h("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", 
            this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect();
          }, r.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect) return this;
            var t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) h("reconnect failed"), 
            this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1; else {
              var e = this.backoff.duration();
              h("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
              var n = setTimeout(function() {
                t.skipReconnect || (h("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), 
                t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function(e) {
                  e ? (h("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (h("reconnect success"), 
                  t.onreconnect());
                }));
              }, e);
              this.subs.push({
                destroy: function destroy() {
                  clearTimeout(n);
                }
              });
            }
          }, r.prototype.onreconnect = function() {
            var t = this.backoff.attempts;
            this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t);
          };
        }, function(t, e, n) {
          t.exports = n(14), t.exports.parser = n(21);
        }, function(t, e, n) {
          function r(t, e) {
            return this instanceof r ? (e = e || {}, t && "object" == ("undefined" === typeof t ? "undefined" : _typeof(t)) && (e = t, 
            t = null), t ? (t = u(t), e.hostname = t.host, e.secure = "https" === t.protocol || "wss" === t.protocol, 
            e.port = t.port, t.query && (e.query = t.query)) : e.host && (e.hostname = u(e.host).host), 
            this.secure = null != e.secure ? e.secure : "undefined" != typeof location && "https:" === location.protocol, 
            e.hostname && !e.port && (e.port = this.secure ? "443" : "80"), this.agent = e.agent || !1, 
            this.hostname = e.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), 
            this.port = e.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? 443 : 80), 
            this.query = e.query || {}, "string" == typeof this.query && (this.query = h.decode(this.query)), 
            this.upgrade = !1 !== e.upgrade, this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/", 
            this.forceJSONP = !!e.forceJSONP, this.jsonp = !1 !== e.jsonp, this.forceBase64 = !!e.forceBase64, 
            this.enablesXDR = !!e.enablesXDR, this.timestampParam = e.timestampParam || "t", 
            this.timestampRequests = e.timestampRequests, this.transports = e.transports || [ "polling", "websocket" ], 
            this.transportOptions = e.transportOptions || {}, this.readyState = "", this.writeBuffer = [], 
            this.prevBufferLen = 0, this.policyPort = e.policyPort || 843, this.rememberUpgrade = e.rememberUpgrade || !1, 
            this.binaryType = null, this.onlyBinaryUpgrades = e.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== e.perMessageDeflate && (e.perMessageDeflate || {}), 
            !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), 
            this.pfx = e.pfx || null, this.key = e.key || null, this.passphrase = e.passphrase || null, 
            this.cert = e.cert || null, this.ca = e.ca || null, this.ciphers = e.ciphers || null, 
            this.rejectUnauthorized = void 0 === e.rejectUnauthorized || e.rejectUnauthorized, 
            this.forceNode = !!e.forceNode, this.isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), 
            ("undefined" == typeof self || this.isReactNative) && (e.extraHeaders && Object.keys(e.extraHeaders).length > 0 && (this.extraHeaders = e.extraHeaders), 
            e.localAddress && (this.localAddress = e.localAddress)), this.id = null, this.upgrades = null, 
            this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, 
            this.pingTimeoutTimer = null, void this.open()) : new r(t, e);
          }
          function o(t) {
            var e = {};
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            return e;
          }
          var i = n(15), s = n(8), a = n(3)("engine.io-client:socket"), c = n(35), p = n(21), u = n(2), h = n(29);
          t.exports = r, r.priorWebsocketSuccess = !1, s(r.prototype), r.protocol = p.protocol, 
          r.Socket = r, r.Transport = n(20), r.transports = n(15), r.parser = n(21), r.prototype.createTransport = function(t) {
            a('creating transport "%s"', t);
            var e = o(this.query);
            e.EIO = p.protocol, e.transport = t;
            var n = this.transportOptions[t] || {};
            this.id && (e.sid = this.id);
            var r = new i[t]({
              query: e,
              socket: this,
              agent: n.agent || this.agent,
              hostname: n.hostname || this.hostname,
              port: n.port || this.port,
              secure: n.secure || this.secure,
              path: n.path || this.path,
              forceJSONP: n.forceJSONP || this.forceJSONP,
              jsonp: n.jsonp || this.jsonp,
              forceBase64: n.forceBase64 || this.forceBase64,
              enablesXDR: n.enablesXDR || this.enablesXDR,
              timestampRequests: n.timestampRequests || this.timestampRequests,
              timestampParam: n.timestampParam || this.timestampParam,
              policyPort: n.policyPort || this.policyPort,
              pfx: n.pfx || this.pfx,
              key: n.key || this.key,
              passphrase: n.passphrase || this.passphrase,
              cert: n.cert || this.cert,
              ca: n.ca || this.ca,
              ciphers: n.ciphers || this.ciphers,
              rejectUnauthorized: n.rejectUnauthorized || this.rejectUnauthorized,
              perMessageDeflate: n.perMessageDeflate || this.perMessageDeflate,
              extraHeaders: n.extraHeaders || this.extraHeaders,
              forceNode: n.forceNode || this.forceNode,
              localAddress: n.localAddress || this.localAddress,
              requestTimeout: n.requestTimeout || this.requestTimeout,
              protocols: n.protocols || void 0,
              isReactNative: this.isReactNative
            });
            return r;
          }, r.prototype.open = function() {
            var t;
            if (this.rememberUpgrade && r.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) t = "websocket"; else {
              if (0 === this.transports.length) {
                var e = this;
                return void setTimeout(function() {
                  e.emit("error", "No transports available");
                }, 0);
              }
              t = this.transports[0];
            }
            this.readyState = "opening";
            try {
              t = this.createTransport(t);
            } catch (n) {
              return this.transports.shift(), void this.open();
            }
            t.open(), this.setTransport(t);
          }, r.prototype.setTransport = function(t) {
            a("setting transport %s", t.name);
            var e = this;
            this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), 
            this.transport = t, t.on("drain", function() {
              e.onDrain();
            }).on("packet", function(t) {
              e.onPacket(t);
            }).on("error", function(t) {
              e.onError(t);
            }).on("close", function() {
              e.onClose("transport close");
            });
          }, r.prototype.probe = function(t) {
            function e() {
              if (f.onlyBinaryUpgrades) {
                var e = !this.supportsBinary && f.transport.supportsBinary;
                h = h || e;
              }
              h || (a('probe transport "%s" opened', t), u.send([ {
                type: "ping",
                data: "probe"
              } ]), u.once("packet", function(e) {
                if (!h) if ("pong" === e.type && "probe" === e.data) {
                  if (a('probe transport "%s" pong', t), f.upgrading = !0, f.emit("upgrading", u), 
                  !u) return;
                  r.priorWebsocketSuccess = "websocket" === u.name, a('pausing current transport "%s"', f.transport.name), 
                  f.transport.pause(function() {
                    h || "closed" !== f.readyState && (a("changing transport and sending upgrade packet"), 
                    p(), f.setTransport(u), u.send([ {
                      type: "upgrade"
                    } ]), f.emit("upgrade", u), u = null, f.upgrading = !1, f.flush());
                  });
                } else {
                  a('probe transport "%s" failed', t);
                  var n = new Error("probe error");
                  n.transport = u.name, f.emit("upgradeError", n);
                }
              }));
            }
            function n() {
              h || (h = !0, p(), u.close(), u = null);
            }
            function o(e) {
              var r = new Error("probe error: " + e);
              r.transport = u.name, n(), a('probe transport "%s" failed because of error: %s', t, e), 
              f.emit("upgradeError", r);
            }
            function i() {
              o("transport closed");
            }
            function s() {
              o("socket closed");
            }
            function c(t) {
              u && t.name !== u.name && (a('"%s" works - aborting "%s"', t.name, u.name), n());
            }
            function p() {
              u.removeListener("open", e), u.removeListener("error", o), u.removeListener("close", i), 
              f.removeListener("close", s), f.removeListener("upgrading", c);
            }
            a('probing transport "%s"', t);
            var u = this.createTransport(t, {
              probe: 1
            }), h = !1, f = this;
            r.priorWebsocketSuccess = !1, u.once("open", e), u.once("error", o), u.once("close", i), 
            this.once("close", s), this.once("upgrading", c), u.open();
          }, r.prototype.onOpen = function() {
            if (a("socket open"), this.readyState = "open", r.priorWebsocketSuccess = "websocket" === this.transport.name, 
            this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
              a("starting upgrade probes");
              for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t]);
            }
          }, r.prototype.onPacket = function(t) {
            if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), 
            this.emit("packet", t), this.emit("heartbeat"), t.type) {
             case "open":
              this.onHandshake(JSON.parse(t.data));
              break;

             case "pong":
              this.setPing(), this.emit("pong");
              break;

             case "error":
              var e = new Error("server error");
              e.code = t.data, this.onError(e);
              break;

             case "message":
              this.emit("data", t.data), this.emit("message", t.data);
            } else a('packet received with socket readyState "%s"', this.readyState);
          }, r.prototype.onHandshake = function(t) {
            this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), 
            this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), 
            "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), 
            this.on("heartbeat", this.onHeartbeat));
          }, r.prototype.onHeartbeat = function(t) {
            clearTimeout(this.pingTimeoutTimer);
            var e = this;
            e.pingTimeoutTimer = setTimeout(function() {
              "closed" !== e.readyState && e.onClose("ping timeout");
            }, t || e.pingInterval + e.pingTimeout);
          }, r.prototype.setPing = function() {
            var t = this;
            clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function() {
              a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), 
              t.onHeartbeat(t.pingTimeout);
            }, t.pingInterval);
          }, r.prototype.ping = function() {
            var t = this;
            this.sendPacket("ping", function() {
              t.emit("ping");
            });
          }, r.prototype.onDrain = function() {
            this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
          }, r.prototype.flush = function() {
            "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), 
            this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, 
            this.emit("flush"));
          }, r.prototype.write = r.prototype.send = function(t, e, n) {
            return this.sendPacket("message", t, e, n), this;
          }, r.prototype.sendPacket = function(t, e, n, r) {
            if ("function" == typeof e && (r = e, e = void 0), "function" == typeof n && (r = n, 
            n = null), "closing" !== this.readyState && "closed" !== this.readyState) {
              n = n || {}, n.compress = !1 !== n.compress;
              var o = {
                type: t,
                data: e,
                options: n
              };
              this.emit("packetCreate", o), this.writeBuffer.push(o), r && this.once("flush", r), 
              this.flush();
            }
          }, r.prototype.close = function() {
            function t() {
              r.onClose("forced close"), a("socket closing - telling transport to close"), r.transport.close();
            }
            function e() {
              r.removeListener("upgrade", e), r.removeListener("upgradeError", e), t();
            }
            function n() {
              r.once("upgrade", e), r.once("upgradeError", e);
            }
            if ("opening" === this.readyState || "open" === this.readyState) {
              this.readyState = "closing";
              var r = this;
              this.writeBuffer.length ? this.once("drain", function() {
                this.upgrading ? n() : t();
              }) : this.upgrading ? n() : t();
            }
            return this;
          }, r.prototype.onError = function(t) {
            a("socket error %j", t), r.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t);
          }, r.prototype.onClose = function(t, e) {
            if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
              a('socket close with reason: "%s"', t);
              var n = this;
              clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), 
              this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", 
              this.id = null, this.emit("close", t, e), n.writeBuffer = [], n.prevBufferLen = 0;
            }
          }, r.prototype.filterUpgrades = function(t) {
            for (var e = [], n = 0, r = t.length; n < r; n++) ~c(this.transports, t[n]) && e.push(t[n]);
            return e;
          };
        }, function(t, e, n) {
          function r(t) {
            var e, n = !1, r = !1, a = !1 !== t.jsonp;
            if ("undefined" != typeof location) {
              var c = "https:" === location.protocol, p = location.port;
              p || (p = c ? 443 : 80), n = t.hostname !== location.hostname || p !== t.port, r = t.secure !== c;
            }
            if (t.xdomain = n, t.xscheme = r, e = new o(t), "open" in e && !t.forceJSONP) return new i(t);
            if (!a) throw new Error("JSONP disabled");
            return new s(t);
          }
          var o = n(16), i = n(18), s = n(32), a = n(33);
          e.polling = r, e.websocket = a;
        }, function(t, e, n) {
          var r = n(17);
          t.exports = function(t) {
            var e = t.xdomain, n = t.xscheme, o = t.enablesXDR;
            try {
              if ("undefined" != typeof XMLHttpRequest && (!e || r)) return new XMLHttpRequest();
            } catch (i) {}
            try {
              if ("undefined" != typeof XDomainRequest && !n && o) return new XDomainRequest();
            } catch (i) {}
            if (!e) try {
              return new (self[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
            } catch (i) {}
          };
        }, function(t, e) {
          try {
            t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
          } catch (n) {
            t.exports = !1;
          }
        }, function(t, e, n) {
          function r() {}
          function o(t) {
            if (c.call(this, t), this.requestTimeout = t.requestTimeout, this.extraHeaders = t.extraHeaders, 
            "undefined" != typeof location) {
              var e = "https:" === location.protocol, n = location.port;
              n || (n = e ? 443 : 80), this.xd = "undefined" != typeof location && t.hostname !== location.hostname || n !== t.port, 
              this.xs = t.secure !== e;
            }
          }
          function i(t) {
            this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, 
            this.async = !1 !== t.async, this.data = void 0 !== t.data ? t.data : null, this.agent = t.agent, 
            this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, 
            this.requestTimeout = t.requestTimeout, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, 
            this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, 
            this.extraHeaders = t.extraHeaders, this.create();
          }
          function s() {
            for (var t in i.requests) i.requests.hasOwnProperty(t) && i.requests[t].abort();
          }
          var a = n(16), c = n(19), p = n(8), u = n(30), h = n(3)("engine.io-client:polling-xhr");
          if (t.exports = o, t.exports.Request = i, u(o, c), o.prototype.supportsBinary = !0, 
          o.prototype.request = function(t) {
            return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, 
            t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, 
            t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, 
            t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, t.requestTimeout = this.requestTimeout, 
            t.extraHeaders = this.extraHeaders, new i(t);
          }, o.prototype.doWrite = function(t, e) {
            var n = "string" != typeof t && void 0 !== t, r = this.request({
              method: "POST",
              data: t,
              isBinary: n
            }), o = this;
            r.on("success", e), r.on("error", function(t) {
              o.onError("xhr post error", t);
            }), this.sendXhr = r;
          }, o.prototype.doPoll = function() {
            h("xhr poll");
            var t = this.request(), e = this;
            t.on("data", function(t) {
              e.onData(t);
            }), t.on("error", function(t) {
              e.onError("xhr poll error", t);
            }), this.pollXhr = t;
          }, p(i.prototype), i.prototype.create = function() {
            var t = {
              agent: this.agent,
              xdomain: this.xd,
              xscheme: this.xs,
              enablesXDR: this.enablesXDR
            };
            t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, 
            t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
            var e = this.xhr = new a(t), n = this;
            try {
              h("xhr open %s: %s", this.method, this.uri), e.open(this.method, this.uri, this.async);
              try {
                if (this.extraHeaders) {
                  e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0);
                  for (var r in this.extraHeaders) this.extraHeaders.hasOwnProperty(r) && e.setRequestHeader(r, this.extraHeaders[r]);
                }
              } catch (o) {}
              if ("POST" === this.method) try {
                this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
              } catch (o) {}
              try {
                e.setRequestHeader("Accept", "*/*");
              } catch (o) {}
              "withCredentials" in e && (e.withCredentials = !0), this.requestTimeout && (e.timeout = this.requestTimeout), 
              this.hasXDR() ? (e.onload = function() {
                n.onLoad();
              }, e.onerror = function() {
                n.onError(e.responseText);
              }) : e.onreadystatechange = function() {
                if (2 === e.readyState) try {
                  var t = e.getResponseHeader("Content-Type");
                  n.supportsBinary && "application/octet-stream" === t && (e.responseType = "arraybuffer");
                } catch (r) {}
                4 === e.readyState && (200 === e.status || 1223 === e.status ? n.onLoad() : setTimeout(function() {
                  n.onError(e.status);
                }, 0));
              }, h("xhr data %s", this.data), e.send(this.data);
            } catch (o) {
              return void setTimeout(function() {
                n.onError(o);
              }, 0);
            }
            "undefined" != typeof document && (this.index = i.requestsCount++, i.requests[this.index] = this);
          }, i.prototype.onSuccess = function() {
            this.emit("success"), this.cleanup();
          }, i.prototype.onData = function(t) {
            this.emit("data", t), this.onSuccess();
          }, i.prototype.onError = function(t) {
            this.emit("error", t), this.cleanup(!0);
          }, i.prototype.cleanup = function(t) {
            if ("undefined" != typeof this.xhr && null !== this.xhr) {
              if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = r : this.xhr.onreadystatechange = r, 
              t) try {
                this.xhr.abort();
              } catch (e) {}
              "undefined" != typeof document && delete i.requests[this.index], this.xhr = null;
            }
          }, i.prototype.onLoad = function() {
            var t;
            try {
              var e;
              try {
                e = this.xhr.getResponseHeader("Content-Type");
              } catch (n) {}
              t = "application/octet-stream" === e && this.xhr.response || this.xhr.responseText;
            } catch (n) {
              this.onError(n);
            }
            null != t && this.onData(t);
          }, i.prototype.hasXDR = function() {
            return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR;
          }, i.prototype.abort = function() {
            this.cleanup();
          }, i.requestsCount = 0, i.requests = {}, "undefined" != typeof document) if ("function" == typeof attachEvent) attachEvent("onunload", s); else if ("function" == typeof addEventListener) {
            var f = "onpagehide" in self ? "pagehide" : "unload";
            addEventListener(f, s, !1);
          }
        }, function(t, e, n) {
          function r(t) {
            var e = t && t.forceBase64;
            u && !e || (this.supportsBinary = !1), o.call(this, t);
          }
          var o = n(20), i = n(29), s = n(21), a = n(30), c = n(31), p = n(3)("engine.io-client:polling");
          t.exports = r;
          var u = function() {
            var t = n(16), e = new t({
              xdomain: !1
            });
            return null != e.responseType;
          }();
          a(r, o), r.prototype.name = "polling", r.prototype.doOpen = function() {
            this.poll();
          }, r.prototype.pause = function(t) {
            function e() {
              p("paused"), n.readyState = "paused", t();
            }
            var n = this;
            if (this.readyState = "pausing", this.polling || !this.writable) {
              var r = 0;
              this.polling && (p("we are currently polling - waiting to pause"), r++, this.once("pollComplete", function() {
                p("pre-pause polling complete"), --r || e();
              })), this.writable || (p("we are currently writing - waiting to pause"), r++, this.once("drain", function() {
                p("pre-pause writing complete"), --r || e();
              }));
            } else e();
          }, r.prototype.poll = function() {
            p("polling"), this.polling = !0, this.doPoll(), this.emit("poll");
          }, r.prototype.onData = function(t) {
            var e = this;
            p("polling got data %s", t);
            var n = function n(t, _n, r) {
              return "opening" === e.readyState && e.onOpen(), "close" === t.type ? (e.onClose(), 
              !1) : void e.onPacket(t);
            };
            s.decodePayload(t, this.socket.binaryType, n), "closed" !== this.readyState && (this.polling = !1, 
            this.emit("pollComplete"), "open" === this.readyState ? this.poll() : p('ignoring poll - transport state "%s"', this.readyState));
          }, r.prototype.doClose = function() {
            function t() {
              p("writing close packet"), e.write([ {
                type: "close"
              } ]);
            }
            var e = this;
            "open" === this.readyState ? (p("transport open - closing"), t()) : (p("transport not open - deferring close"), 
            this.once("open", t));
          }, r.prototype.write = function(t) {
            var e = this;
            this.writable = !1;
            var n = function n() {
              e.writable = !0, e.emit("drain");
            };
            s.encodePayload(t, this.supportsBinary, function(t) {
              e.doWrite(t, n);
            });
          }, r.prototype.uri = function() {
            var t = this.query || {}, e = this.secure ? "https" : "http", n = "";
            !1 !== this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || t.sid || (t.b64 = 1), 
            t = i.encode(t), this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (n = ":" + this.port), 
            t.length && (t = "?" + t);
            var r = -1 !== this.hostname.indexOf(":");
            return e + "://" + (r ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t;
          };
        }, function(t, e, n) {
          function r(t) {
            this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, 
            this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, 
            this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, 
            this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, 
            this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, 
            this.forceNode = t.forceNode, this.isReactNative = t.isReactNative, this.extraHeaders = t.extraHeaders, 
            this.localAddress = t.localAddress;
          }
          var o = n(21), i = n(8);
          t.exports = r, i(r.prototype), r.prototype.onError = function(t, e) {
            var n = new Error(t);
            return n.type = "TransportError", n.description = e, this.emit("error", n), this;
          }, r.prototype.open = function() {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", 
            this.doOpen()), this;
          }, r.prototype.close = function() {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), 
            this.onClose()), this;
          }, r.prototype.send = function(t) {
            if ("open" !== this.readyState) throw new Error("Transport not open");
            this.write(t);
          }, r.prototype.onOpen = function() {
            this.readyState = "open", this.writable = !0, this.emit("open");
          }, r.prototype.onData = function(t) {
            var e = o.decodePacket(t, this.socket.binaryType);
            this.onPacket(e);
          }, r.prototype.onPacket = function(t) {
            this.emit("packet", t);
          }, r.prototype.onClose = function() {
            this.readyState = "closed", this.emit("close");
          };
        }, function(t, e, n) {
          function r(t, n) {
            var r = "b" + e.packets[t.type] + t.data.data;
            return n(r);
          }
          function o(t, n, r) {
            if (!n) return e.encodeBase64Packet(t, r);
            var o = t.data, i = new Uint8Array(o), s = new Uint8Array(1 + o.byteLength);
            s[0] = v[t.type];
            for (var a = 0; a < i.length; a++) s[a + 1] = i[a];
            return r(s.buffer);
          }
          function i(t, n, r) {
            if (!n) return e.encodeBase64Packet(t, r);
            var o = new FileReader();
            return o.onload = function() {
              e.encodePacket({
                type: t.type,
                data: o.result
              }, n, !0, r);
            }, o.readAsArrayBuffer(t.data);
          }
          function s(t, n, r) {
            if (!n) return e.encodeBase64Packet(t, r);
            if (g) return i(t, n, r);
            var o = new Uint8Array(1);
            o[0] = v[t.type];
            var s = new k([ o.buffer, t.data ]);
            return r(s);
          }
          function a(t) {
            try {
              t = d.decode(t, {
                strict: !1
              });
            } catch (e) {
              return !1;
            }
            return t;
          }
          function c(t, e, n) {
            for (var r = new Array(t.length), o = l(t.length, n), i = function i(t, n, o) {
              e(n, function(e, n) {
                r[t] = n, o(e, r);
              });
            }, s = 0; s < t.length; s++) i(s, t[s], o);
          }
          var p, u = n(22), h = n(23), f = n(24), l = n(25), d = n(26);
          "undefined" != typeof ArrayBuffer && (p = n(27));
          var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent), m = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent), g = y || m;
          e.protocol = 3;
          var v = e.packets = {
            open: 0,
            close: 1,
            ping: 2,
            pong: 3,
            message: 4,
            upgrade: 5,
            noop: 6
          }, b = u(v), w = {
            type: "error",
            data: "parser error"
          }, k = n(28);
          e.encodePacket = function(t, e, n, i) {
            "function" == typeof e && (i = e, e = !1), "function" == typeof n && (i = n, n = null);
            var a = void 0 === t.data ? void 0 : t.data.buffer || t.data;
            if ("undefined" != typeof ArrayBuffer && a instanceof ArrayBuffer) return o(t, e, i);
            if ("undefined" != typeof k && a instanceof k) return s(t, e, i);
            if (a && a.base64) return r(t, i);
            var c = v[t.type];
            return void 0 !== t.data && (c += n ? d.encode(String(t.data), {
              strict: !1
            }) : String(t.data)), i("" + c);
          }, e.encodeBase64Packet = function(t, n) {
            var r = "b" + e.packets[t.type];
            if ("undefined" != typeof k && t.data instanceof k) {
              var o = new FileReader();
              return o.onload = function() {
                var t = o.result.split(",")[1];
                n(r + t);
              }, o.readAsDataURL(t.data);
            }
            var i;
            try {
              i = String.fromCharCode.apply(null, new Uint8Array(t.data));
            } catch (s) {
              for (var a = new Uint8Array(t.data), c = new Array(a.length), p = 0; p < a.length; p++) c[p] = a[p];
              i = String.fromCharCode.apply(null, c);
            }
            return r += btoa(i), n(r);
          }, e.decodePacket = function(t, n, r) {
            if (void 0 === t) return w;
            if ("string" == typeof t) {
              if ("b" === t.charAt(0)) return e.decodeBase64Packet(t.substr(1), n);
              if (r && (t = a(t), !1 === t)) return w;
              var o = t.charAt(0);
              return Number(o) == o && b[o] ? t.length > 1 ? {
                type: b[o],
                data: t.substring(1)
              } : {
                type: b[o]
              } : w;
            }
            var i = new Uint8Array(t), o = i[0], s = f(t, 1);
            return k && "blob" === n && (s = new k([ s ])), {
              type: b[o],
              data: s
            };
          }, e.decodeBase64Packet = function(t, e) {
            var n = b[t.charAt(0)];
            if (!p) return {
              type: n,
              data: {
                base64: !0,
                data: t.substr(1)
              }
            };
            var r = p.decode(t.substr(1));
            return "blob" === e && k && (r = new k([ r ])), {
              type: n,
              data: r
            };
          }, e.encodePayload = function(t, n, r) {
            function o(t) {
              return t.length + ":" + t;
            }
            function i(t, r) {
              e.encodePacket(t, !!s && n, !1, function(t) {
                r(null, o(t));
              });
            }
            "function" == typeof n && (r = n, n = null);
            var s = h(t);
            return n && s ? k && !g ? e.encodePayloadAsBlob(t, r) : e.encodePayloadAsArrayBuffer(t, r) : t.length ? void c(t, i, function(t, e) {
              return r(e.join(""));
            }) : r("0:");
          }, e.decodePayload = function(t, n, r) {
            if ("string" != typeof t) return e.decodePayloadAsBinary(t, n, r);
            "function" == typeof n && (r = n, n = null);
            var o;
            if ("" === t) return r(w, 0, 1);
            for (var i, s, a = "", c = 0, p = t.length; c < p; c++) {
              var u = t.charAt(c);
              if (":" === u) {
                if ("" === a || a != (i = Number(a))) return r(w, 0, 1);
                if (s = t.substr(c + 1, i), a != s.length) return r(w, 0, 1);
                if (s.length) {
                  if (o = e.decodePacket(s, n, !1), w.type === o.type && w.data === o.data) return r(w, 0, 1);
                  var h = r(o, c + i, p);
                  if (!1 === h) return;
                }
                c += i, a = "";
              } else a += u;
            }
            return "" !== a ? r(w, 0, 1) : void 0;
          }, e.encodePayloadAsArrayBuffer = function(t, n) {
            function r(t, n) {
              e.encodePacket(t, !0, !0, function(t) {
                return n(null, t);
              });
            }
            return t.length ? void c(t, r, function(t, e) {
              var r = e.reduce(function(t, e) {
                var n;
                return n = "string" == typeof e ? e.length : e.byteLength, t + n.toString().length + n + 2;
              }, 0), o = new Uint8Array(r), i = 0;
              return e.forEach(function(t) {
                var e = "string" == typeof t, n = t;
                if (e) {
                  for (var r = new Uint8Array(t.length), s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
                  n = r.buffer;
                }
                o[i++] = e ? 0 : 1;
                for (var a = n.byteLength.toString(), s = 0; s < a.length; s++) o[i++] = parseInt(a[s]);
                o[i++] = 255;
                for (var r = new Uint8Array(n), s = 0; s < r.length; s++) o[i++] = r[s];
              }), n(o.buffer);
            }) : n(new ArrayBuffer(0));
          }, e.encodePayloadAsBlob = function(t, n) {
            function r(t, n) {
              e.encodePacket(t, !0, !0, function(t) {
                var e = new Uint8Array(1);
                if (e[0] = 1, "string" == typeof t) {
                  for (var r = new Uint8Array(t.length), o = 0; o < t.length; o++) r[o] = t.charCodeAt(o);
                  t = r.buffer, e[0] = 0;
                }
                for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) a[o] = parseInt(s[o]);
                if (a[s.length] = 255, k) {
                  var c = new k([ e.buffer, a.buffer, t ]);
                  n(null, c);
                }
              });
            }
            c(t, r, function(t, e) {
              return n(new k(e));
            });
          }, e.decodePayloadAsBinary = function(t, n, r) {
            "function" == typeof n && (r = n, n = null);
            for (var o = t, i = []; o.byteLength > 0; ) {
              for (var s = new Uint8Array(o), a = 0 === s[0], c = "", p = 1; 255 !== s[p]; p++) {
                if (c.length > 310) return r(w, 0, 1);
                c += s[p];
              }
              o = f(o, 2 + c.length), c = parseInt(c);
              var u = f(o, 0, c);
              if (a) try {
                u = String.fromCharCode.apply(null, new Uint8Array(u));
              } catch (h) {
                var l = new Uint8Array(u);
                u = "";
                for (var p = 0; p < l.length; p++) u += String.fromCharCode(l[p]);
              }
              i.push(u), o = f(o, c);
            }
            var d = i.length;
            i.forEach(function(t, o) {
              r(e.decodePacket(t, n, !0), o, d);
            });
          };
        }, function(t, e) {
          t.exports = Object.keys || function(t) {
            var e = [], n = Object.prototype.hasOwnProperty;
            for (var r in t) n.call(t, r) && e.push(r);
            return e;
          };
        }, function(t, e, n) {
          function r(t) {
            if (!t || "object" != ("undefined" === typeof t ? "undefined" : _typeof(t))) return !1;
            if (o(t)) {
              for (var e = 0, n = t.length; e < n; e++) if (r(t[e])) return !0;
              return !1;
            }
            if ("function" == typeof Buffer && Buffer.isBuffer && Buffer.isBuffer(t) || "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || s && t instanceof Blob || a && t instanceof File) return !0;
            if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length) return r(t.toJSON(), !0);
            for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i) && r(t[i])) return !0;
            return !1;
          }
          var o = n(10), i = Object.prototype.toString, s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob), a = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File);
          t.exports = r;
        }, function(t, e) {
          t.exports = function(t, e, n) {
            var r = t.byteLength;
            if (e = e || 0, n = n || r, t.slice) return t.slice(e, n);
            if (e < 0 && (e += r), n < 0 && (n += r), n > r && (n = r), e >= r || e >= n || 0 === r) return new ArrayBuffer(0);
            for (var o = new Uint8Array(t), i = new Uint8Array(n - e), s = e, a = 0; s < n; s++, 
            a++) i[a] = o[s];
            return i.buffer;
          };
        }, function(t, e) {
          function n(t, e, n) {
            function o(t, r) {
              if (o.count <= 0) throw new Error("after called too many times");
              --o.count, t ? (i = !0, e(t), e = n) : 0 !== o.count || i || e(null, r);
            }
            var i = !1;
            return n = n || r, o.count = t, 0 === t ? e() : o;
          }
          function r() {}
          t.exports = n;
        }, function(t, e) {
          function n(t) {
            for (var e, n, r = [], o = 0, i = t.length; o < i; ) e = t.charCodeAt(o++), e >= 55296 && e <= 56319 && o < i ? (n = t.charCodeAt(o++), 
            56320 == (64512 & n) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), 
            o--)) : r.push(e);
            return r;
          }
          function r(t) {
            for (var e, n = t.length, r = -1, o = ""; ++r < n; ) e = t[r], e > 65535 && (e -= 65536, 
            o += d(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += d(e);
            return o;
          }
          function o(t, e) {
            if (t >= 55296 && t <= 57343) {
              if (e) throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value");
              return !1;
            }
            return !0;
          }
          function i(t, e) {
            return d(t >> e & 63 | 128);
          }
          function s(t, e) {
            if (0 == (4294967168 & t)) return d(t);
            var n = "";
            return 0 == (4294965248 & t) ? n = d(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (o(t, e) || (t = 65533), 
            n = d(t >> 12 & 15 | 224), n += i(t, 6)) : 0 == (4292870144 & t) && (n = d(t >> 18 & 7 | 240), 
            n += i(t, 12), n += i(t, 6)), n + d(63 & t | 128);
          }
          function a(t, e) {
            e = e || {};
            for (var r, o = !1 !== e.strict, i = n(t), a = i.length, c = -1, p = ""; ++c < a; ) r = i[c], 
            p += s(r, o);
            return p;
          }
          function c() {
            if (l >= f) throw Error("Invalid byte index");
            var t = 255 & h[l];
            if (l++, 128 == (192 & t)) return 63 & t;
            throw Error("Invalid continuation byte");
          }
          function p(t) {
            var e, n, r, i, s;
            if (l > f) throw Error("Invalid byte index");
            if (l == f) return !1;
            if (e = 255 & h[l], l++, 0 == (128 & e)) return e;
            if (192 == (224 & e)) {
              if (n = c(), s = (31 & e) << 6 | n, s >= 128) return s;
              throw Error("Invalid continuation byte");
            }
            if (224 == (240 & e)) {
              if (n = c(), r = c(), s = (15 & e) << 12 | n << 6 | r, s >= 2048) return o(s, t) ? s : 65533;
              throw Error("Invalid continuation byte");
            }
            if (240 == (248 & e) && (n = c(), r = c(), i = c(), s = (7 & e) << 18 | n << 12 | r << 6 | i, 
            s >= 65536 && s <= 1114111)) return s;
            throw Error("Invalid UTF-8 detected");
          }
          function u(t, e) {
            e = e || {};
            var o = !1 !== e.strict;
            h = n(t), f = h.length, l = 0;
            for (var i, s = []; !1 !== (i = p(o)); ) s.push(i);
            return r(s);
          }
          var h, f, l, d = String.fromCharCode;
          t.exports = {
            version: "2.1.2",
            encode: a,
            decode: u
          };
        }, function(t, e) {
          !function() {
            for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = new Uint8Array(256), r = 0; r < t.length; r++) n[t.charCodeAt(r)] = r;
            e.encode = function(e) {
              var n, r = new Uint8Array(e), o = r.length, i = "";
              for (n = 0; n < o; n += 3) i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], 
              i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]];
              return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="), 
              i;
            }, e.decode = function(t) {
              var e, r, o, i, s, a = .75 * t.length, c = t.length, p = 0;
              "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
              var u = new ArrayBuffer(a), h = new Uint8Array(u);
              for (e = 0; e < c; e += 4) r = n[t.charCodeAt(e)], o = n[t.charCodeAt(e + 1)], i = n[t.charCodeAt(e + 2)], 
              s = n[t.charCodeAt(e + 3)], h[p++] = r << 2 | o >> 4, h[p++] = (15 & o) << 4 | i >> 2, 
              h[p++] = (3 & i) << 6 | 63 & s;
              return u;
            };
          }();
        }, function(t, e) {
          function n(t) {
            return t.map(function(t) {
              if (t.buffer instanceof ArrayBuffer) {
                var e = t.buffer;
                if (t.byteLength !== e.byteLength) {
                  var n = new Uint8Array(t.byteLength);
                  n.set(new Uint8Array(e, t.byteOffset, t.byteLength)), e = n.buffer;
                }
                return e;
              }
              return t;
            });
          }
          function r(t, e) {
            e = e || {};
            var r = new i();
            return n(t).forEach(function(t) {
              r.append(t);
            }), e.type ? r.getBlob(e.type) : r.getBlob();
          }
          function o(t, e) {
            return new Blob(n(t), e || {});
          }
          var i = "undefined" != typeof i ? i : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder, s = function() {
            try {
              var t = new Blob([ "hi" ]);
              return 2 === t.size;
            } catch (e) {
              return !1;
            }
          }(), a = s && function() {
            try {
              var t = new Blob([ new Uint8Array([ 1, 2 ]) ]);
              return 2 === t.size;
            } catch (e) {
              return !1;
            }
          }(), c = i && i.prototype.append && i.prototype.getBlob;
          "undefined" != typeof Blob && (r.prototype = Blob.prototype, o.prototype = Blob.prototype), 
          t.exports = function() {
            return s ? a ? Blob : o : c ? r : void 0;
          }();
        }, function(t, e) {
          e.encode = function(t) {
            var e = "";
            for (var n in t) t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
            return e;
          }, e.decode = function(t) {
            for (var e = {}, n = t.split("&"), r = 0, o = n.length; r < o; r++) {
              var i = n[r].split("=");
              e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
            }
            return e;
          };
        }, function(t, e) {
          t.exports = function(t, e) {
            var n = function n() {};
            n.prototype = e.prototype, t.prototype = new n(), t.prototype.constructor = t;
          };
        }, function(t, e) {
          function n(t) {
            var e = "";
            do {
              e = s[t % a] + e, t = Math.floor(t / a);
            } while (t > 0);
            return e;
          }
          function r(t) {
            var e = 0;
            for (u = 0; u < t.length; u++) e = e * a + c[t.charAt(u)];
            return e;
          }
          function o() {
            var t = n(+new Date());
            return t !== i ? (p = 0, i = t) : t + "." + n(p++);
          }
          for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, p = 0, u = 0; u < a; u++) c[s[u]] = u;
          o.encode = n, o.decode = r, t.exports = o;
        }, function(t, e, n) {
          (function(e) {
            function r() {}
            function o() {
              return "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof e ? e : {};
            }
            function i(t) {
              if (s.call(this, t), this.query = this.query || {}, !c) {
                var e = o();
                c = e.___eio = e.___eio || [];
              }
              this.index = c.length;
              var n = this;
              c.push(function(t) {
                n.onData(t);
              }), this.query.j = this.index, "function" == typeof addEventListener && addEventListener("beforeunload", function() {
                n.script && (n.script.onerror = r);
              }, !1);
            }
            var s = n(19), a = n(30);
            t.exports = i;
            var c, p = /\n/g, u = /\\n/g;
            a(i, s), i.prototype.supportsBinary = !1, i.prototype.doClose = function() {
              this.script && (this.script.parentNode.removeChild(this.script), this.script = null), 
              this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), 
              s.prototype.doClose.call(this);
            }, i.prototype.doPoll = function() {
              var t = this, e = document.createElement("script");
              this.script && (this.script.parentNode.removeChild(this.script), this.script = null), 
              e.async = !0, e.src = this.uri(), e.onerror = function(e) {
                t.onError("jsonp poll error", e);
              };
              var n = document.getElementsByTagName("script")[0];
              n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e), 
              this.script = e;
              var r = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
              r && setTimeout(function() {
                var t = document.createElement("iframe");
                document.body.appendChild(t), document.body.removeChild(t);
              }, 100);
            }, i.prototype.doWrite = function(t, e) {
              function n() {
                r(), e();
              }
              function r() {
                if (o.iframe) try {
                  o.form.removeChild(o.iframe);
                } catch (t) {
                  o.onError("jsonp polling iframe removal error", t);
                }
                try {
                  var e = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                  i = document.createElement(e);
                } catch (t) {
                  i = document.createElement("iframe"), i.name = o.iframeId, i.src = "javascript:0";
                }
                i.id = o.iframeId, o.form.appendChild(i), o.iframe = i;
              }
              var o = this;
              if (!this.form) {
                var i, s = document.createElement("form"), a = document.createElement("textarea"), c = this.iframeId = "eio_iframe_" + this.index;
                s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", 
                s.style.left = "-1000px", s.target = c, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), 
                a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a;
              }
              this.form.action = this.uri(), r(), t = t.replace(u, "\\\n"), this.area.value = t.replace(p, "\\n");
              try {
                this.form.submit();
              } catch (h) {}
              this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                "complete" === o.iframe.readyState && n();
              } : this.iframe.onload = n;
            };
          }).call(e, function() {
            return this;
          }());
        }, function(t, e, n) {
          function r(t) {
            var e = t && t.forceBase64;
            e && (this.supportsBinary = !1), this.perMessageDeflate = t.perMessageDeflate, this.usingBrowserWebSocket = o && !t.forceNode, 
            this.protocols = t.protocols, this.usingBrowserWebSocket || (l = i), s.call(this, t);
          }
          var o, i, s = n(20), a = n(21), c = n(29), p = n(30), u = n(31), h = n(3)("engine.io-client:websocket");
          if ("undefined" == typeof self) try {
            i = n(34);
          } catch (f) {} else o = self.WebSocket || self.MozWebSocket;
          var l = o || i;
          t.exports = r, p(r, s), r.prototype.name = "websocket", r.prototype.supportsBinary = !0, 
          r.prototype.doOpen = function() {
            if (this.check()) {
              var t = this.uri(), e = this.protocols, n = {
                agent: this.agent,
                perMessageDeflate: this.perMessageDeflate
              };
              n.pfx = this.pfx, n.key = this.key, n.passphrase = this.passphrase, n.cert = this.cert, 
              n.ca = this.ca, n.ciphers = this.ciphers, n.rejectUnauthorized = this.rejectUnauthorized, 
              this.extraHeaders && (n.headers = this.extraHeaders), this.localAddress && (n.localAddress = this.localAddress);
              try {
                this.ws = this.usingBrowserWebSocket && !this.isReactNative ? e ? new l(t, e) : new l(t) : new l(t, e, n);
              } catch (r) {
                return this.emit("error", r);
              }
              void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, 
              this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners();
            }
          }, r.prototype.addEventListeners = function() {
            var t = this;
            this.ws.onopen = function() {
              t.onOpen();
            }, this.ws.onclose = function() {
              t.onClose();
            }, this.ws.onmessage = function(e) {
              t.onData(e.data);
            }, this.ws.onerror = function(e) {
              t.onError("websocket error", e);
            };
          }, r.prototype.write = function(t) {
            function e() {
              n.emit("flush"), setTimeout(function() {
                n.writable = !0, n.emit("drain");
              }, 0);
            }
            var n = this;
            this.writable = !1;
            for (var r = t.length, o = 0, i = r; o < i; o++) !function(t) {
              a.encodePacket(t, n.supportsBinary, function(o) {
                if (!n.usingBrowserWebSocket) {
                  var i = {};
                  if (t.options && (i.compress = t.options.compress), n.perMessageDeflate) {
                    var s = "string" == typeof o ? Buffer.byteLength(o) : o.length;
                    s < n.perMessageDeflate.threshold && (i.compress = !1);
                  }
                }
                try {
                  n.usingBrowserWebSocket ? n.ws.send(o) : n.ws.send(o, i);
                } catch (a) {
                  h("websocket closed before onclose event");
                }
                --r || e();
              });
            }(t[o]);
          }, r.prototype.onClose = function() {
            s.prototype.onClose.call(this);
          }, r.prototype.doClose = function() {
            "undefined" != typeof this.ws && this.ws.close();
          }, r.prototype.uri = function() {
            var t = this.query || {}, e = this.secure ? "wss" : "ws", n = "";
            this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (n = ":" + this.port), 
            this.timestampRequests && (t[this.timestampParam] = u()), this.supportsBinary || (t.b64 = 1), 
            t = c.encode(t), t.length && (t = "?" + t);
            var r = -1 !== this.hostname.indexOf(":");
            return e + "://" + (r ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t;
          }, r.prototype.check = function() {
            return !(!l || "__initialize" in l && this.name === r.prototype.name);
          };
        }, function(t, e) {}, function(t, e) {
          var n = [].indexOf;
          t.exports = function(t, e) {
            if (n) return t.indexOf(e);
            for (var r = 0; r < t.length; ++r) if (t[r] === e) return r;
            return -1;
          };
        }, function(t, e, n) {
          function r(t, e, n) {
            this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], 
            this.sendBuffer = [], this.connected = !1, this.disconnected = !0, this.flags = {}, 
            n && n.query && (this.query = n.query), this.io.autoConnect && this.open();
          }
          var o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          }, i = n(7), s = n(8), a = n(37), c = n(38), p = n(39), u = n(3)("socket.io-client:socket"), h = n(29), f = n(23);
          t.exports = e = r;
          var l = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
          }, d = s.prototype.emit;
          s(r.prototype), r.prototype.subEvents = function() {
            if (!this.subs) {
              var t = this.io;
              this.subs = [ c(t, "open", p(this, "onopen")), c(t, "packet", p(this, "onpacket")), c(t, "close", p(this, "onclose")) ];
            }
          }, r.prototype.open = r.prototype.connect = function() {
            return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), 
            this.emit("connecting"), this);
          }, r.prototype.send = function() {
            var t = a(arguments);
            return t.unshift("message"), this.emit.apply(this, t), this;
          }, r.prototype.emit = function(t) {
            if (l.hasOwnProperty(t)) return d.apply(this, arguments), this;
            var e = a(arguments), n = {
              type: (void 0 !== this.flags.binary ? this.flags.binary : f(e)) ? i.BINARY_EVENT : i.EVENT,
              data: e
            };
            return n.options = {}, n.options.compress = !this.flags || !1 !== this.flags.compress, 
            "function" == typeof e[e.length - 1] && (u("emitting packet with ack id %d", this.ids), 
            this.acks[this.ids] = e.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), 
            this.flags = {}, this;
          }, r.prototype.packet = function(t) {
            t.nsp = this.nsp, this.io.packet(t);
          }, r.prototype.onopen = function() {
            if (u("transport is open - connecting"), "/" !== this.nsp) if (this.query) {
              var t = "object" === o(this.query) ? h.encode(this.query) : this.query;
              u("sending connect packet with query %s", t), this.packet({
                type: i.CONNECT,
                query: t
              });
            } else this.packet({
              type: i.CONNECT
            });
          }, r.prototype.onclose = function(t) {
            u("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, 
            this.emit("disconnect", t);
          }, r.prototype.onpacket = function(t) {
            var e = t.nsp === this.nsp, n = t.type === i.ERROR && "/" === t.nsp;
            if (e || n) switch (t.type) {
             case i.CONNECT:
              this.onconnect();
              break;

             case i.EVENT:
             case i.BINARY_EVENT:
              this.onevent(t);
              break;

             case i.ACK:
             case i.BINARY_ACK:
              this.onack(t);
              break;

             case i.DISCONNECT:
              this.ondisconnect();
              break;

             case i.ERROR:
              this.emit("error", t.data);
            }
          }, r.prototype.onevent = function(t) {
            var e = t.data || [];
            u("emitting event %j", e), null != t.id && (u("attaching ack callback to event"), 
            e.push(this.ack(t.id))), this.connected ? d.apply(this, e) : this.receiveBuffer.push(e);
          }, r.prototype.ack = function(t) {
            var e = this, n = !1;
            return function() {
              if (!n) {
                n = !0;
                var r = a(arguments);
                u("sending ack %j", r), e.packet({
                  type: f(r) ? i.BINARY_ACK : i.ACK,
                  id: t,
                  data: r
                });
              }
            };
          }, r.prototype.onack = function(t) {
            var e = this.acks[t.id];
            "function" == typeof e ? (u("calling ack %s with %j", t.id, t.data), e.apply(this, t.data), 
            delete this.acks[t.id]) : u("bad ack %s", t.id);
          }, r.prototype.onconnect = function() {
            this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered();
          }, r.prototype.emitBuffered = function() {
            var t;
            for (t = 0; t < this.receiveBuffer.length; t++) d.apply(this, this.receiveBuffer[t]);
            for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
            this.sendBuffer = [];
          }, r.prototype.ondisconnect = function() {
            u("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect");
          }, r.prototype.destroy = function() {
            if (this.subs) {
              for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
              this.subs = null;
            }
            this.io.destroy(this);
          }, r.prototype.close = r.prototype.disconnect = function() {
            return this.connected && (u("performing disconnect (%s)", this.nsp), this.packet({
              type: i.DISCONNECT
            })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
          }, r.prototype.compress = function(t) {
            return this.flags.compress = t, this;
          }, r.prototype.binary = function(t) {
            return this.flags.binary = t, this;
          };
        }, function(t, e) {
          function n(t, e) {
            var n = [];
            e = e || 0;
            for (var r = e || 0; r < t.length; r++) n[r - e] = t[r];
            return n;
          }
          t.exports = n;
        }, function(t, e) {
          function n(t, e, n) {
            return t.on(e, n), {
              destroy: function destroy() {
                t.removeListener(e, n);
              }
            };
          }
          t.exports = n;
        }, function(t, e) {
          var n = [].slice;
          t.exports = function(t, e) {
            if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
            var r = n.call(arguments, 2);
            return function() {
              return e.apply(t, r.concat(n.call(arguments)));
            };
          };
        }, function(t, e) {
          function n(t) {
            t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, 
            this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
          }
          t.exports = n, n.prototype.duration = function() {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
              var e = Math.random(), n = Math.floor(e * this.jitter * t);
              t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n;
            }
            return 0 | Math.min(t, this.max);
          }, n.prototype.reset = function() {
            this.attempts = 0;
          }, n.prototype.setMin = function(t) {
            this.ms = t;
          }, n.prototype.setMax = function(t) {
            this.max = t;
          }, n.prototype.setJitter = function(t) {
            this.jitter = t;
          };
        } ]);
      });
      cc._RF.pop();
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 2
  } ]
}, {}, [ "Controller", "Games", "Loading", "Login", "Notice", "SubMenu", "SubMenuHead", "dialog", "dialog_daily", "dialog_giftcode", "dialog_muathe", "dialog_muathe_item", "dialog_napthe", "dialog_profile", "dialog_profile_pass", "dialog_thecao", "dialog_users", "dialog_users_update_pass", "dialog_users_update_red", "dialog_users_update_xu", "panel", "DaiLy", "GiftCode", "GiftCode_item", "MuaThe", "MuaThe_item", "NapThe", "NapThe_item", "NhaMang", "TheCao", "TheCao_itemMenhGia", "TheCao_itemNhaMang", "Users", "Users_item", "panel_body", "panel_let_menu", "panel_menu", "panel_menu_item", "TaiXiu", "TaiXiu_Main", "BrowserUtil", "Helper", "Pagination", "Pagination_item", "backgroundDisable", "hoverScale", "socket.io", "item_daily" ]);