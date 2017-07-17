/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 162);
/******/ })
/************************************************************************/
/******/ ({

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = __webpack_require__(43);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ONE_MINUTE = 30 * 1000;
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
chrome.browserAction.setBadgeText({ text: "" });
chrome.extension.onConnect.addListener(function (port) {
  console.log("Connected .....");
  port.onMessage.addListener(function (msg) {
    console.log(msg);
    triggerMsg(msg
    //          port.postMessage("Hi Popup.js");
    );
  });
});

var WatchDog = function () {
  function WatchDog() {
    _classCallCheck(this, WatchDog);

    this.watchList = [];
    this.barkHandlers = [];
    this.timeoutInterval = null;
    this.reLoadList();
  }

  _createClass(WatchDog, [{
    key: "onDestroy",
    value: function onDestroy() {}
  }, {
    key: "onBark",
    value: function onBark(handler) {
      this.barkHandlers.push(handler);
    }
  }, {
    key: "reLoadList",
    value: function reLoadList() {
      var nowTimeStamp = new Date().getTime();
      var data = (0, _storage.getData)();
      alertNoteIds = {};
      this.watchList = data.filter(function (item) {
        if (item.remindTime > nowTimeStamp) {
          return true;
        } else if (item.remindTime < nowTimeStamp) {
          alertNoteIds[item.id] = item;
        }
      });

      var length = Object.keys(alertNoteIds).length;
      var text = length ? length + "" : "";
      chrome.browserAction.setBadgeText({ text: text });

      this.watchList.sort(function (a, b) {
        return parseInt(a.remindTime) > parseInt(b.remindTime);
      });
      this._checkMinTime();
    }
  }, {
    key: "_checkMinTime",
    value: function _checkMinTime() {
      var _this = this;

      if (this.watchList.length < 1) {
        return;
      }
      var nowTimeStamp = new Date().getTime();
      var minRemindTime = this.watchList[0].remindTime;
      var surplusTime = minRemindTime - nowTimeStamp;
      console.log(surplusTime / 2000, this.watchList);
      if (surplusTime < 2000) {
        var _loop = function _loop(i) {
          var temp = _this.watchList[i];
          if (temp.remindTime - 2000 < nowTimeStamp) {
            _this.barkHandlers.forEach(function (item) {
              item(temp);
            });
            _this.watchList.splice(i, 1);
          }
        };

        //小于3秒，触发
        for (var i = 0; i < this.watchList.length; i++) {
          _loop(i);
        }
        this._checkMinTime();
      } else {
        this.timeoutInterval ? clearTimeout(this.timeoutInterval) : "";
        this.timeoutInterval = setTimeout(function () {
          _this._checkMinTime();
        }, surplusTime / 2);
      }
    }
  }]);

  return WatchDog;
}();

var TimerWatchDog = void 0;
var alertNoteIds = {};

function newWatchDog() {
  TimerWatchDog = new WatchDog();
  TimerWatchDog.onDestroy(function () {});
  TimerWatchDog.onBark(function (note) {
    alertNoteIds[note.id] = note;
    chrome.browserAction.setBadgeText({ text: Object.keys(alertNoteIds).length + " " });
  });
}
newWatchDog();

var MSGManage = {
  "ADD_REMIND_TIME": function ADD_REMIND_TIME(msg) {
    if (!TimerWatchDog) {
      newWatchDog();
    } else {
      TimerWatchDog.reLoadList();
    }
  },
  "CLEAR_REMIND": function CLEAR_REMIND(msg) {
    TimerWatchDog.reLoadList();
  }
};

function triggerMsg(msg) {
  MSGManage[msg.TYPE] ? MSGManage[msg.TYPE](msg) : "";
}

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getCleanTime = exports.getCleanTime = function getCleanTime(date) {
  return new Date(date.toLocaleString().split(" ")[0]).getTime();
};

var getDayHoursMinute = exports.getDayHoursMinute = function getDayHoursMinute(time) {
  var total_minutes = parseInt(time / (60 * 1000));
  var day = parseInt(total_minutes / (24 * 60));
  var hours = parseInt(total_minutes % (24 * 60) / 60);
  var minutes = parseInt(total_minutes % (24 * 60) % 60) + 1;
  var a = "";
  if (day > 0) {
    a += day + " 天, " + hours + " 小时, " + minutes + " 分钟";
  } else if (hours > 0) {
    a += hours + " 小时, " + minutes + "分钟";
  } else if (minutes > 0) {
    a += minutes + " 分钟";
  }
  return { day: day, hours: hours, minutes: minutes, "text": a };
};

var ObjectCompare = exports.ObjectCompare = function ObjectCompare(x, y, cb) {
  var p = void 0;
  if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
    return true;
  }
  if (x === y) {
    return true;
  }
  if (typeof x === 'function' && typeof y === 'function') {
    if (x instanceof RegExp && y instanceof RegExp || x instanceof String || y instanceof String || x instanceof Number || y instanceof Number) {
      return x.toString() === y.toString();
    } else {
      return false;
    }
  }
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }
  if (!(x instanceof Object && y instanceof Object)) {
    return false;
  }
  if (x.prototype !== y.prototype) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (p in y) {
    if (!x.hasOwnProperty(p)) {
      cb(p);
      return false;
    }
  }
  for (p in x) {
    if (!y.hasOwnProperty(p)) {
      cb(p);
      return false;
    }
    if (_typeof(y[p]) !== _typeof(x[p])) {
      cb(p);
      return false;
    }
    if (!ObjectCompare(x[p], y[p], cb)) {
      cb(p);
      return false;
    }
  }
  return true;
};

/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FupdateNode = exports.onNoteListChange = exports.addNode = exports.updateNode = exports.getData = undefined;

var _common = __webpack_require__(32);

var LocalData = void 0;
var noteListHandlerList = [];
var localStorage = window.localStorage;

if (!localStorage.Data) {
  localStorage.Data = '{"noteList":[]}';
}

LocalData = JSON.parse(localStorage.Data);

function _fireNoteListHandlerUpdate(node) {
  for (var i in noteListHandlerList) {
    var handler = noteListHandlerList[i];
    handler(node, LocalData.noteList);
  }
}

function _createNoteId() {
  var length = LocalData.noteList.length;
  var id = new Date().getTime() + "_" + length;
  return id;
}

function _saveLocalToStorage(node) {
  localStorage.Data = JSON.stringify(LocalData);
  _fireNoteListHandlerUpdate(node);
}

var getData = exports.getData = function getData() {
  var localData = JSON.parse(localStorage.Data);
  return localData.noteList;
};

var updateNode = exports.updateNode = function updateNode(note, callback) {
  var findNodeIndex = void 0;
  var findNote = LocalData.noteList.find(function (item, index) {
    if (item.id == note.id) {
      findNodeIndex = index;
      return item;
    }
  });
  var updateKey = null;
  var OC = (0, _common.ObjectCompare)(note, findNote, function (_updateKey) {
    updateKey = _updateKey;
  });
  if (OC) {
    return;
  } else if (!OC && updateKey == "text") {
    note.lastEditTime = new Date().getTime();
  }

  if (note.delete) {
    LocalData.noteList.splice(findNodeIndex, 1);
  } else if (note.doneTime) {
    delete findNote.remindTime;
    delete findNote.updateRemindTime;
    findNote.doneTime = note.doneTime;
  } else {
    for (var i in note) {
      if (i != "id" && note[i] != undefined) {
        findNote[i] = note[i];
      }
    }
  }
  _saveLocalToStorage(findNote);
};

var addNode = exports.addNode = function addNode(node, callback) {
  if (!node.text) {
    return;
  }
  node["id"] = _createNoteId();
  LocalData.noteList.unshift(node);
  _saveLocalToStorage(node);
};

var onNoteListChange = exports.onNoteListChange = function onNoteListChange(handler) {
  noteListHandlerList.push(handler);
};

var FupdateNode = exports.FupdateNode = function FupdateNode() {
  return fetch(request.path, {
    method: 'POST',
    //credentials: 'omit',
    credentials: 'include',
    body: JSON.stringify(request.data),
    headers: {
      "X-CSRF-TOKEN": csrfToken,
      "content-type": 'application/json'
    }
  }).then(function (res) {
    return res.json();
  }).then(function (res) {}).catch(function (err) {
    if (err) {
      throw err;
    }
  });
};

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTgwNTUwOTYxMjJmZDNkZGE5M2E/NDg2ZCIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdG9vbHMvY29tbW9uLmpzPzY3NTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2xzL3N0b3JhZ2UuanM/NTgxYSJdLCJuYW1lcyI6WyJPTkVfTUlOVVRFIiwiY2hyb21lIiwiYnJvd3NlckFjdGlvbiIsInNldEJhZGdlQmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJzZXRCYWRnZVRleHQiLCJ0ZXh0IiwiZXh0ZW5zaW9uIiwib25Db25uZWN0IiwiYWRkTGlzdGVuZXIiLCJwb3J0IiwiY29uc29sZSIsImxvZyIsIm9uTWVzc2FnZSIsIm1zZyIsInRyaWdnZXJNc2ciLCJXYXRjaERvZyIsIndhdGNoTGlzdCIsImJhcmtIYW5kbGVycyIsInRpbWVvdXRJbnRlcnZhbCIsInJlTG9hZExpc3QiLCJoYW5kbGVyIiwicHVzaCIsIm5vd1RpbWVTdGFtcCIsIkRhdGUiLCJnZXRUaW1lIiwiZGF0YSIsImFsZXJ0Tm90ZUlkcyIsImZpbHRlciIsIml0ZW0iLCJyZW1pbmRUaW1lIiwiaWQiLCJsZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic29ydCIsImEiLCJiIiwicGFyc2VJbnQiLCJfY2hlY2tNaW5UaW1lIiwibWluUmVtaW5kVGltZSIsInN1cnBsdXNUaW1lIiwiaSIsInRlbXAiLCJmb3JFYWNoIiwic3BsaWNlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsIlRpbWVyV2F0Y2hEb2ciLCJuZXdXYXRjaERvZyIsIm9uRGVzdHJveSIsIm9uQmFyayIsIm5vdGUiLCJNU0dNYW5hZ2UiLCJUWVBFIiwiZ2V0Q2xlYW5UaW1lIiwiZGF0ZSIsInRvTG9jYWxlU3RyaW5nIiwic3BsaXQiLCJnZXREYXlIb3Vyc01pbnV0ZSIsInRpbWUiLCJ0b3RhbF9taW51dGVzIiwiZGF5IiwiaG91cnMiLCJtaW51dGVzIiwiT2JqZWN0Q29tcGFyZSIsIngiLCJ5IiwiY2IiLCJwIiwiaXNOYU4iLCJSZWdFeHAiLCJTdHJpbmciLCJOdW1iZXIiLCJ0b1N0cmluZyIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwiaGFzT3duUHJvcGVydHkiLCJMb2NhbERhdGEiLCJub3RlTGlzdEhhbmRsZXJMaXN0IiwibG9jYWxTdG9yYWdlIiwid2luZG93IiwiRGF0YSIsIkpTT04iLCJwYXJzZSIsIl9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlIiwibm9kZSIsIm5vdGVMaXN0IiwiX2NyZWF0ZU5vdGVJZCIsIl9zYXZlTG9jYWxUb1N0b3JhZ2UiLCJzdHJpbmdpZnkiLCJnZXREYXRhIiwibG9jYWxEYXRhIiwidXBkYXRlTm9kZSIsImNhbGxiYWNrIiwiZmluZE5vZGVJbmRleCIsImZpbmROb3RlIiwiZmluZCIsImluZGV4IiwidXBkYXRlS2V5IiwiT0MiLCJfdXBkYXRlS2V5IiwibGFzdEVkaXRUaW1lIiwiZGVsZXRlIiwiZG9uZVRpbWUiLCJ1cGRhdGVSZW1pbmRUaW1lIiwidW5kZWZpbmVkIiwiYWRkTm9kZSIsInVuc2hpZnQiLCJvbk5vdGVMaXN0Q2hhbmdlIiwiRnVwZGF0ZU5vZGUiLCJmZXRjaCIsInJlcXVlc3QiLCJwYXRoIiwibWV0aG9kIiwiY3JlZGVudGlhbHMiLCJib2R5IiwiaGVhZGVycyIsImNzcmZUb2tlbiIsInRoZW4iLCJyZXMiLCJqc29uIiwiY2F0Y2giLCJlcnIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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U0FBTCxDQUFlc0IsUUFBUXRGLElBQXZCLENBSmdCO0FBS3JCMkYsYUFBUTtBQUNKLHNCQUFlQyxTQURYO0FBRUosc0JBQWdCO0FBRlo7QUFMYSxHQUFwQixFQVNGQyxJQVRFLENBU0csVUFBU0MsR0FBVCxFQUFjO0FBQ2xCLFdBQU9BLElBQUlDLElBQUosRUFBUDtBQUNILEdBWEksRUFXRkYsSUFYRSxDQVdHLFVBQVVDLEdBQVYsRUFBYyxDQUNyQixDQVpJLEVBWUZFLEtBWkUsQ0FZSSxVQUFTQyxHQUFULEVBQWM7QUFDbkIsUUFBR0EsR0FBSCxFQUFPO0FBQ0gsWUFBTUEsR0FBTjtBQUNIO0FBQ0osR0FoQkksQ0FBUDtBQWlCRCxDQWxCTSxDIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE2Mik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTgwNTUwOTYxMjJmZDNkZGE5M2EiLCJpbXBvcnQge2dldERhdGF9IGZyb20gXCIuL3Rvb2xzL3N0b3JhZ2VcIlxuY29uc3QgT05FX01JTlVURT0zMCoxMDAwO1xuY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IoeyBjb2xvcjogWzI1NSwgMCwgMCwgMjU1XX0pO1xuY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OlwiXCJ9KTtcbmNocm9tZS5leHRlbnNpb24ub25Db25uZWN0LmFkZExpc3RlbmVyKGZ1bmN0aW9uKHBvcnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGVkIC4uLi4uXCIpO1xuICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHRyaWdnZXJNc2cobXNnKSBcbiAvLyAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKFwiSGkgUG9wdXAuanNcIik7XG4gICAgICB9KTtcbn0pXG5cbmNsYXNzIFdhdGNoRG9ne1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMud2F0Y2hMaXN0PVtdO1xuICAgIHRoaXMuYmFya0hhbmRsZXJzPVtdO1xuICAgIHRoaXMudGltZW91dEludGVydmFsPW51bGw7XG4gICAgdGhpcy5yZUxvYWRMaXN0KCk7XG4gIH1cbiAgb25EZXN0cm95KCl7XG5cbiAgfVxuICBvbkJhcmsoaGFuZGxlcil7XG4gICAgdGhpcy5iYXJrSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgfVxuICByZUxvYWRMaXN0KCl7XG4gICAgY29uc3Qgbm93VGltZVN0YW1wPW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IGRhdGE9Z2V0RGF0YSgpO1xuICAgIGFsZXJ0Tm90ZUlkcz17fTtcbiAgICB0aGlzLndhdGNoTGlzdD1kYXRhLmZpbHRlcigoaXRlbSk9PntcbiAgICAgIGlmKGl0ZW0ucmVtaW5kVGltZT5ub3dUaW1lU3RhbXApe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1lbHNlIGlmKGl0ZW0ucmVtaW5kVGltZTxub3dUaW1lU3RhbXApe1xuICAgICAgICBhbGVydE5vdGVJZHNbaXRlbS5pZF09aXRlbTtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgbGVuZ3RoPU9iamVjdC5rZXlzKGFsZXJ0Tm90ZUlkcykubGVuZ3RoO1xuICAgIGNvbnN0IHRleHQ9bGVuZ3RoP2xlbmd0aCtcIlwiOlwiXCI7XG4gICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OnRleHR9KTtcblxuICAgIHRoaXMud2F0Y2hMaXN0LnNvcnQoKGEsYik9PntcbiAgICAgIHJldHVybiBwYXJzZUludChhLnJlbWluZFRpbWUpPnBhcnNlSW50KGIucmVtaW5kVGltZSk7XG4gICAgfSk7XG4gICAgdGhpcy5fY2hlY2tNaW5UaW1lKCk7XG4gIH1cbiAgX2NoZWNrTWluVGltZSgpe1xuICAgIGlmKHRoaXMud2F0Y2hMaXN0Lmxlbmd0aDwxKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm93VGltZVN0YW1wPW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IG1pblJlbWluZFRpbWU9dGhpcy53YXRjaExpc3RbMF0ucmVtaW5kVGltZTtcbiAgICBjb25zdCBzdXJwbHVzVGltZT1taW5SZW1pbmRUaW1lLW5vd1RpbWVTdGFtcDtcbiAgICBjb25zb2xlLmxvZyhzdXJwbHVzVGltZS8yMDAwLHRoaXMud2F0Y2hMaXN0KTtcbiAgICBpZihzdXJwbHVzVGltZTwyMDAwKXsvL+Wwj+S6jjPnp5LvvIzop6blj5FcbiAgICAgIGZvcihsZXQgaSA9MDsgaTx0aGlzLndhdGNoTGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgbGV0IHRlbXA9dGhpcy53YXRjaExpc3RbaV07XG4gICAgICAgIGlmKHRlbXAucmVtaW5kVGltZS0yMDAwPG5vd1RpbWVTdGFtcCl7XG4gICAgICAgICAgdGhpcy5iYXJrSGFuZGxlcnMuZm9yRWFjaCgoaXRlbSk9PntcbiAgICAgICAgICAgIGl0ZW0odGVtcCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy53YXRjaExpc3Quc3BsaWNlKGksMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX2NoZWNrTWluVGltZSgpO1xuICAgIH1lbHNlIHtcbiAgICB0aGlzLnRpbWVvdXRJbnRlcnZhbD9jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SW50ZXJ2YWwpOlwiXCI7XG4gICAgdGhpcy50aW1lb3V0SW50ZXJ2YWw9c2V0VGltZW91dCgoKT0+e1xuICAgICAgICB0aGlzLl9jaGVja01pblRpbWUoKTtcbiAgICAgIH0sc3VycGx1c1RpbWUvMik7XG4gICAgfVxuICB9XG59XG5cbmxldCBUaW1lcldhdGNoRG9nO1xubGV0IGFsZXJ0Tm90ZUlkcz17fTtcblxuZnVuY3Rpb24gbmV3V2F0Y2hEb2coKXtcbiAgVGltZXJXYXRjaERvZz1uZXcgV2F0Y2hEb2coKTtcbiAgVGltZXJXYXRjaERvZy5vbkRlc3Ryb3koKCk9PntcblxuICB9KTtcbiAgVGltZXJXYXRjaERvZy5vbkJhcmsoKG5vdGUpPT57XG4gICAgYWxlcnROb3RlSWRzW25vdGUuaWRdPW5vdGU7XG4gICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OiAoT2JqZWN0LmtleXMoYWxlcnROb3RlSWRzKS5sZW5ndGgpK1wiIFwifSk7XG4gIH0pO1xufVxubmV3V2F0Y2hEb2coKTtcblxuY29uc3QgTVNHTWFuYWdlID0ge1xuICBcIkFERF9SRU1JTkRfVElNRVwiKG1zZyl7XG4gICAgaWYoIVRpbWVyV2F0Y2hEb2cpe1xuICAgICAgbmV3V2F0Y2hEb2coKTtcbiAgICB9ZWxzZXtcbiAgICAgIFRpbWVyV2F0Y2hEb2cucmVMb2FkTGlzdCgpO1xuICAgIH1cbiAgfSxcbiAgXCJDTEVBUl9SRU1JTkRcIihtc2cpe1xuICAgIFRpbWVyV2F0Y2hEb2cucmVMb2FkTGlzdCgpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdHJpZ2dlck1zZyhtc2cpe1xuICBNU0dNYW5hZ2VbbXNnLlRZUEVdP01TR01hbmFnZVttc2cuVFlQRV0obXNnKTpcIlwiO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2JhY2tncm91bmQuanMiLCJleHBvcnQgY29uc3QgZ2V0Q2xlYW5UaW1lPShkYXRlKT0+e1xuICByZXR1cm4gbmV3IERhdGUoZGF0ZS50b0xvY2FsZVN0cmluZygpLnNwbGl0KFwiIFwiKVswXSkuZ2V0VGltZSgpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0RGF5SG91cnNNaW51dGU9KHRpbWUpPT57XG4gICAgY29uc3QgdG90YWxfbWludXRlcz1wYXJzZUludCh0aW1lLyg2MCoxMDAwKSk7XG4gICAgY29uc3QgZGF5PXBhcnNlSW50KHRvdGFsX21pbnV0ZXMvKDI0KjYwKSk7XG4gICAgY29uc3QgaG91cnM9cGFyc2VJbnQodG90YWxfbWludXRlcyUoMjQqNjApLzYwKTtcbiAgICBjb25zdCBtaW51dGVzPXBhcnNlSW50KHRvdGFsX21pbnV0ZXMlKDI0KjYwKSU2MCkrMTtcbiAgICBsZXQgYT1cIlwiO1xuICAgIGlmKGRheT4wKXtcbiAgICAgIGErPWRheStcIiDlpKksIFwiK2hvdXJzK1wiIOWwj+aXtiwgXCIrbWludXRlcytcIiDliIbpkp9cIjtcbiAgICB9ZWxzZSBpZihob3Vycz4wKXtcbiAgICAgIGErPWhvdXJzK1wiIOWwj+aXtiwgXCIrbWludXRlcytcIuWIhumSn1wiO1xuICAgIH1lbHNlIGlmKG1pbnV0ZXM+MCl7XG4gICAgICBhKz1taW51dGVzK1wiIOWIhumSn1wiO1xuICAgIH1cbiAgICByZXR1cm4ge2RheSxob3VycyxtaW51dGVzLFwidGV4dFwiOmF9XG59XG5cbmV4cG9ydCBjb25zdCBPYmplY3RDb21wYXJlID0gKHgsIHksY2IpID0+e1xuICBsZXQgcFxuICBpZiAodHlwZW9mIHggPT09ICdudW1iZXInICYmIHR5cGVvZiB5ID09PSAnbnVtYmVyJyAmJiBpc05hTih4KSAmJiBpc05hTih5KSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgaWYgKHggPT09IHkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGlmICh0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICgoeCBpbnN0YW5jZW9mIFJlZ0V4cCAmJiB5IGluc3RhbmNlb2YgUmVnRXhwKSB8fFxuICAgICh4IGluc3RhbmNlb2YgU3RyaW5nIHx8IHkgaW5zdGFuY2VvZiBTdHJpbmcpIHx8XG4gICAgKHggaW5zdGFuY2VvZiBOdW1iZXIgfHwgeSBpbnN0YW5jZW9mIE51bWJlcikpIHtcbiAgICAgIHJldHVybiB4LnRvU3RyaW5nKCkgPT09IHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBEYXRlICYmIHkgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIHguZ2V0VGltZSgpID09PSB5LmdldFRpbWUoKVxuICB9XG4gIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QgJiYgeSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAoeC5wcm90b3R5cGUgIT09IHkucHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgaWYgKHguY29uc3RydWN0b3IgIT09IHkuY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBmb3IgKHAgaW4geSkge1xuICAgIGlmICgheC5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY2IocCk7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbiAgZm9yIChwIGluIHgpIHtcbiAgICBpZiAoIXkuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIGNiKHApO1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmICh0eXBlb2YgeVtwXSAhPT0gdHlwZW9mIHhbcF0pIHtcbiAgICAgIGNiKHApO1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmICghT2JqZWN0Q29tcGFyZSh4W3BdLCB5W3BdLGNiKSkge1xuICAgICAgY2IocCk7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdG9vbHMvY29tbW9uLmpzIiwiaW1wb3J0IHtPYmplY3RDb21wYXJlfSBmcm9tIFwiLi9jb21tb25cIjtcbmxldCBMb2NhbERhdGE7XG5sZXQgbm90ZUxpc3RIYW5kbGVyTGlzdD1bXTtcbmxldCBsb2NhbFN0b3JhZ2U9d2luZG93LmxvY2FsU3RvcmFnZTtcblxuaWYoIWxvY2FsU3RvcmFnZS5EYXRhKXtcbiAgbG9jYWxTdG9yYWdlLkRhdGE9J3tcIm5vdGVMaXN0XCI6W119Jztcbn1cblxuTG9jYWxEYXRhPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLkRhdGEpO1xuXG5mdW5jdGlvbiBfZmlyZU5vdGVMaXN0SGFuZGxlclVwZGF0ZShub2RlKXtcbiAgZm9yKGxldCBpIGluIG5vdGVMaXN0SGFuZGxlckxpc3Qpe1xuICAgIGxldCBoYW5kbGVyPW5vdGVMaXN0SGFuZGxlckxpc3RbaV07XG4gICAgaGFuZGxlcihub2RlLExvY2FsRGF0YS5ub3RlTGlzdCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZU5vdGVJZCgpe1xuICBjb25zdCBsZW5ndGg9TG9jYWxEYXRhLm5vdGVMaXN0Lmxlbmd0aDtcbiAgY29uc3QgaWQ9bmV3IERhdGUoKS5nZXRUaW1lKCkrXCJfXCIrbGVuZ3RoO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIF9zYXZlTG9jYWxUb1N0b3JhZ2Uobm9kZSl7XG4gIGxvY2FsU3RvcmFnZS5EYXRhPUpTT04uc3RyaW5naWZ5KExvY2FsRGF0YSk7XG4gIF9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlKG5vZGUpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBnZXREYXRhPSgpPT57XG4gIGNvbnN0IGxvY2FsRGF0YT1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5EYXRhKTtcbiAgcmV0dXJuIGxvY2FsRGF0YS5ub3RlTGlzdDtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZU5vZGU9KG5vdGUsY2FsbGJhY2spPT57XG4gIGxldCBmaW5kTm9kZUluZGV4O1xuICBjb25zdCBmaW5kTm90ZT1Mb2NhbERhdGEubm90ZUxpc3QuZmluZChmdW5jdGlvbihpdGVtLGluZGV4KXtcbiAgICAgIGlmKGl0ZW0uaWQ9PW5vdGUuaWQpe1xuICAgICAgICBmaW5kTm9kZUluZGV4PWluZGV4O1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgbGV0IHVwZGF0ZUtleT1udWxsOyAgIFxuICBjb25zdCBPQz1PYmplY3RDb21wYXJlKG5vdGUsZmluZE5vdGUsZnVuY3Rpb24oX3VwZGF0ZUtleSl7XG4gICAgdXBkYXRlS2V5PV91cGRhdGVLZXk7XG4gIH0pO1xuICBpZihPQyl7XG4gICAgcmV0dXJuO1xuICB9ZWxzZSBpZighT0MmJnVwZGF0ZUtleT09XCJ0ZXh0XCIpe1xuICAgIG5vdGUubGFzdEVkaXRUaW1lPW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgaWYobm90ZS5kZWxldGUpe1xuICAgIExvY2FsRGF0YS5ub3RlTGlzdC5zcGxpY2UoZmluZE5vZGVJbmRleCwxKTtcbiAgfWVsc2UgaWYobm90ZS5kb25lVGltZSl7XG4gICAgZGVsZXRlIGZpbmROb3RlLnJlbWluZFRpbWU7XG4gICAgZGVsZXRlIGZpbmROb3RlLnVwZGF0ZVJlbWluZFRpbWU7XG4gICAgZmluZE5vdGUuZG9uZVRpbWU9bm90ZS5kb25lVGltZTtcbiAgfWVsc2V7XG4gICAgZm9yKHZhciBpIGluIG5vdGUpe1xuICAgICAgaWYoaSE9XCJpZFwiJiYobm90ZVtpXSE9dW5kZWZpbmVkKSl7XG4gICAgICAgIGZpbmROb3RlW2ldPW5vdGVbaV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX3NhdmVMb2NhbFRvU3RvcmFnZShmaW5kTm90ZSk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZE5vZGU9KG5vZGUsY2FsbGJhY2spPT57XG4gIGlmKCFub2RlLnRleHQpe3JldHVybjt9XG4gIG5vZGVbXCJpZFwiXT1fY3JlYXRlTm90ZUlkKCk7XG4gIExvY2FsRGF0YS5ub3RlTGlzdC51bnNoaWZ0KG5vZGUpO1xuICBfc2F2ZUxvY2FsVG9TdG9yYWdlKG5vZGUpO1xufVxuXG5leHBvcnQgY29uc3Qgb25Ob3RlTGlzdENoYW5nZT0oaGFuZGxlcik9PntcbiAgbm90ZUxpc3RIYW5kbGVyTGlzdC5wdXNoKGhhbmRsZXIpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5leHBvcnQgY29uc3QgRnVwZGF0ZU5vZGU9KCk9PntcbiAgcmV0dXJuIGZldGNoKHJlcXVlc3QucGF0aCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgLy9jcmVkZW50aWFsczogJ29taXQnLFxuICAgICAgICBjcmVkZW50aWFsczonaW5jbHVkZScsXG4gICAgICAgIGJvZHk6SlNPTi5zdHJpbmdpZnkocmVxdWVzdC5kYXRhKSxcbiAgICAgICAgaGVhZGVyczp7XG4gICAgICAgICAgICBcIlgtQ1NSRi1UT0tFTlwiOmNzcmZUb2tlbixcbiAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzKXtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90b29scy9zdG9yYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==