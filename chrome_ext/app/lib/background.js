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
/******/ 	return __webpack_require__(__webpack_require__.s = 161);
/******/ })
/************************************************************************/
/******/ ({

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = __webpack_require__(42);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ONE_MINUTE = 30 * 1000;
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
chrome.browserAction.setBadgeText({ text: "" });
chrome.extension.onConnect.addListener(function (port) {
  console.log("Connected .....");
  port.onMessage.addListener(function (msg) {
    console.log(msg);
    triggerMsg(msg);
    //          port.postMessage("Hi Popup.js");
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

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  if (note.delete) {
    LocalData.noteList.splice(findNodeIndex, 1);
  } else if (note.done) {
    delete findNote.remindTime;
    delete findNote.updateRemindTime;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTJkYzM3M2JlYmIxMmJmNGI5OTg/ZjhlNyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdG9vbHMvc3RvcmFnZS5qcz81ODFhIl0sIm5hbWVzIjpbIk9ORV9NSU5VVEUiLCJjaHJvbWUiLCJicm93c2VyQWN0aW9uIiwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IiLCJjb2xvciIsInNldEJhZGdlVGV4dCIsInRleHQiLCJleHRlbnNpb24iLCJvbkNvbm5lY3QiLCJhZGRMaXN0ZW5lciIsInBvcnQiLCJjb25zb2xlIiwibG9nIiwib25NZXNzYWdlIiwibXNnIiwidHJpZ2dlck1zZyIsIldhdGNoRG9nIiwid2F0Y2hMaXN0IiwiYmFya0hhbmRsZXJzIiwidGltZW91dEludGVydmFsIiwicmVMb2FkTGlzdCIsImhhbmRsZXIiLCJwdXNoIiwibm93VGltZVN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJkYXRhIiwiYWxlcnROb3RlSWRzIiwiZmlsdGVyIiwiaXRlbSIsInJlbWluZFRpbWUiLCJpZCIsImxlbmd0aCIsIk9iamVjdCIsImtleXMiLCJzb3J0IiwiYSIsImIiLCJwYXJzZUludCIsIl9jaGVja01pblRpbWUiLCJtaW5SZW1pbmRUaW1lIiwic3VycGx1c1RpbWUiLCJpIiwidGVtcCIsImZvckVhY2giLCJzcGxpY2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiVGltZXJXYXRjaERvZyIsIm5ld1dhdGNoRG9nIiwib25EZXN0cm95Iiwib25CYXJrIiwibm90ZSIsIk1TR01hbmFnZSIsIlRZUEUiLCJMb2NhbERhdGEiLCJub3RlTGlzdEhhbmRsZXJMaXN0IiwibG9jYWxTdG9yYWdlIiwid2luZG93IiwiRGF0YSIsIkpTT04iLCJwYXJzZSIsIl9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlIiwibm9kZSIsIm5vdGVMaXN0IiwiX2NyZWF0ZU5vdGVJZCIsIl9zYXZlTG9jYWxUb1N0b3JhZ2UiLCJzdHJpbmdpZnkiLCJnZXREYXRhIiwibG9jYWxEYXRhIiwidXBkYXRlTm9kZSIsImNhbGxiYWNrIiwiZmluZE5vZGVJbmRleCIsImZpbmROb3RlIiwiZmluZCIsImluZGV4IiwiZGVsZXRlIiwiZG9uZSIsInVwZGF0ZVJlbWluZFRpbWUiLCJ1bmRlZmluZWQiLCJhZGROb2RlIiwidW5zaGlmdCIsIm9uTm90ZUxpc3RDaGFuZ2UiLCJGdXBkYXRlTm9kZSIsImZldGNoIiwicmVxdWVzdCIsInBhdGgiLCJtZXRob2QiLCJjcmVkZW50aWFscyIsImJvZHkiLCJoZWFkZXJzIiwiY3NyZlRva2VuIiwidGhlbiIsInJlcyIsImpzb24iLCJjYXRjaCIsImVyciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEVBOzs7O0FBQ0EsSUFBTUEsYUFBVyxLQUFHLElBQXBCO0FBQ0FDLE9BQU9DLGFBQVAsQ0FBcUJDLHVCQUFyQixDQUE2QyxFQUFFQyxPQUFPLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxDQUFULEVBQVksR0FBWixDQUFULEVBQTdDO0FBQ0FILE9BQU9DLGFBQVAsQ0FBcUJHLFlBQXJCLENBQWtDLEVBQUNDLE1BQUssRUFBTixFQUFsQztBQUNBTCxPQUFPTSxT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VCxFQUFjO0FBQ2xCLFdBQU9BLElBQUlDLElBQUosRUFBUDtBQUNILEdBWEksRUFXRkYsSUFYRSxDQVdHLFVBQVVDLEdBQVYsRUFBYyxDQUNyQixDQVpJLEVBWUZFLEtBWkUsQ0FZSSxVQUFTQyxHQUFULEVBQWM7QUFDbkIsUUFBR0EsR0FBSCxFQUFPO0FBQ0gsWUFBTUEsR0FBTjtBQUNIO0FBQ0osR0FoQkksQ0FBUDtBQWlCRCxDQWxCTSxDIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE2MSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTJkYzM3M2JlYmIxMmJmNGI5OTgiLCJpbXBvcnQge2dldERhdGF9IGZyb20gXCIuL3Rvb2xzL3N0b3JhZ2VcIlxuY29uc3QgT05FX01JTlVURT0zMCoxMDAwO1xuY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IoeyBjb2xvcjogWzI1NSwgMCwgMCwgMjU1XX0pO1xuY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OlwiXCJ9KTtcbmNocm9tZS5leHRlbnNpb24ub25Db25uZWN0LmFkZExpc3RlbmVyKGZ1bmN0aW9uKHBvcnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGVkIC4uLi4uXCIpO1xuICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHRyaWdnZXJNc2cobXNnKSBcbiAvLyAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKFwiSGkgUG9wdXAuanNcIik7XG4gICAgICB9KTtcbn0pXG5cbmNsYXNzIFdhdGNoRG9ne1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMud2F0Y2hMaXN0PVtdO1xuICAgIHRoaXMuYmFya0hhbmRsZXJzPVtdO1xuICAgIHRoaXMudGltZW91dEludGVydmFsPW51bGw7XG4gICAgdGhpcy5yZUxvYWRMaXN0KCk7XG4gIH1cbiAgb25EZXN0cm95KCl7XG5cbiAgfVxuICBvbkJhcmsoaGFuZGxlcil7XG4gICAgdGhpcy5iYXJrSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgfVxuICByZUxvYWRMaXN0KCl7XG4gICAgY29uc3Qgbm93VGltZVN0YW1wPW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IGRhdGE9Z2V0RGF0YSgpO1xuICAgIGFsZXJ0Tm90ZUlkcz17fTtcbiAgICB0aGlzLndhdGNoTGlzdD1kYXRhLmZpbHRlcigoaXRlbSk9PntcbiAgICAgIGlmKGl0ZW0ucmVtaW5kVGltZT5ub3dUaW1lU3RhbXApe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1lbHNlIGlmKGl0ZW0ucmVtaW5kVGltZTxub3dUaW1lU3RhbXApe1xuICAgICAgICBhbGVydE5vdGVJZHNbaXRlbS5pZF09aXRlbTtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgbGVuZ3RoPU9iamVjdC5rZXlzKGFsZXJ0Tm90ZUlkcykubGVuZ3RoO1xuICAgIGNvbnN0IHRleHQ9bGVuZ3RoP2xlbmd0aCtcIlwiOlwiXCI7XG4gICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OnRleHR9KTtcblxuICAgIHRoaXMud2F0Y2hMaXN0LnNvcnQoKGEsYik9PntcbiAgICAgIHJldHVybiBwYXJzZUludChhLnJlbWluZFRpbWUpPnBhcnNlSW50KGIucmVtaW5kVGltZSk7XG4gICAgfSk7XG4gICAgdGhpcy5fY2hlY2tNaW5UaW1lKCk7XG4gIH1cbiAgX2NoZWNrTWluVGltZSgpe1xuICAgIGlmKHRoaXMud2F0Y2hMaXN0Lmxlbmd0aDwxKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm93VGltZVN0YW1wPW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IG1pblJlbWluZFRpbWU9dGhpcy53YXRjaExpc3RbMF0ucmVtaW5kVGltZTtcbiAgICBjb25zdCBzdXJwbHVzVGltZT1taW5SZW1pbmRUaW1lLW5vd1RpbWVTdGFtcDtcbiAgICBjb25zb2xlLmxvZyhzdXJwbHVzVGltZS8yMDAwLHRoaXMud2F0Y2hMaXN0KTtcbiAgICBpZihzdXJwbHVzVGltZTwyMDAwKXsvL+Wwj+S6jjPnp5LvvIzop6blj5FcbiAgICAgIGZvcihsZXQgaSA9MDsgaTx0aGlzLndhdGNoTGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgbGV0IHRlbXA9dGhpcy53YXRjaExpc3RbaV07XG4gICAgICAgIGlmKHRlbXAucmVtaW5kVGltZS0yMDAwPG5vd1RpbWVTdGFtcCl7XG4gICAgICAgICAgdGhpcy5iYXJrSGFuZGxlcnMuZm9yRWFjaCgoaXRlbSk9PntcbiAgICAgICAgICAgIGl0ZW0odGVtcCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy53YXRjaExpc3Quc3BsaWNlKGksMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX2NoZWNrTWluVGltZSgpO1xuICAgIH1lbHNlIHtcbiAgICB0aGlzLnRpbWVvdXRJbnRlcnZhbD9jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SW50ZXJ2YWwpOlwiXCI7XG4gICAgdGhpcy50aW1lb3V0SW50ZXJ2YWw9c2V0VGltZW91dCgoKT0+e1xuICAgICAgICB0aGlzLl9jaGVja01pblRpbWUoKTtcbiAgICAgIH0sc3VycGx1c1RpbWUvMik7XG4gICAgfVxuICB9XG59XG5cbmxldCBUaW1lcldhdGNoRG9nO1xubGV0IGFsZXJ0Tm90ZUlkcz17fTtcblxuZnVuY3Rpb24gbmV3V2F0Y2hEb2coKXtcbiAgVGltZXJXYXRjaERvZz1uZXcgV2F0Y2hEb2coKTtcbiAgVGltZXJXYXRjaERvZy5vbkRlc3Ryb3koKCk9PntcblxuICB9KTtcbiAgVGltZXJXYXRjaERvZy5vbkJhcmsoKG5vdGUpPT57XG4gICAgYWxlcnROb3RlSWRzW25vdGUuaWRdPW5vdGU7XG4gICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OiAoT2JqZWN0LmtleXMoYWxlcnROb3RlSWRzKS5sZW5ndGgpK1wiIFwifSk7XG4gIH0pO1xufVxubmV3V2F0Y2hEb2coKTtcblxuY29uc3QgTVNHTWFuYWdlID0ge1xuICBcIkFERF9SRU1JTkRfVElNRVwiKG1zZyl7XG4gICAgaWYoIVRpbWVyV2F0Y2hEb2cpe1xuICAgICAgbmV3V2F0Y2hEb2coKTtcbiAgICB9ZWxzZXtcbiAgICAgIFRpbWVyV2F0Y2hEb2cucmVMb2FkTGlzdCgpO1xuICAgIH1cbiAgfSxcbiAgXCJDTEVBUl9SRU1JTkRcIihtc2cpe1xuICAgIFRpbWVyV2F0Y2hEb2cucmVMb2FkTGlzdCgpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdHJpZ2dlck1zZyhtc2cpe1xuICBNU0dNYW5hZ2VbbXNnLlRZUEVdP01TR01hbmFnZVttc2cuVFlQRV0obXNnKTpcIlwiO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2JhY2tncm91bmQuanMiLCJsZXQgTG9jYWxEYXRhO1xubGV0IG5vdGVMaXN0SGFuZGxlckxpc3Q9W107XG5sZXQgbG9jYWxTdG9yYWdlPXdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbmlmKCFsb2NhbFN0b3JhZ2UuRGF0YSl7XG4gIGxvY2FsU3RvcmFnZS5EYXRhPSd7XCJub3RlTGlzdFwiOltdfSc7XG59XG5cbkxvY2FsRGF0YT1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5EYXRhKTtcblxuZnVuY3Rpb24gX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUobm9kZSl7XG4gIGZvcihsZXQgaSBpbiBub3RlTGlzdEhhbmRsZXJMaXN0KXtcbiAgICBsZXQgaGFuZGxlcj1ub3RlTGlzdEhhbmRsZXJMaXN0W2ldO1xuICAgIGhhbmRsZXIobm9kZSxMb2NhbERhdGEubm90ZUxpc3QpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gX2NyZWF0ZU5vdGVJZCgpe1xuICBjb25zdCBsZW5ndGg9TG9jYWxEYXRhLm5vdGVMaXN0Lmxlbmd0aDtcbiAgY29uc3QgaWQ9bmV3IERhdGUoKS5nZXRUaW1lKCkrXCJfXCIrbGVuZ3RoO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIF9zYXZlTG9jYWxUb1N0b3JhZ2Uobm9kZSl7XG4gIGxvY2FsU3RvcmFnZS5EYXRhPUpTT04uc3RyaW5naWZ5KExvY2FsRGF0YSk7XG4gIF9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlKG5vZGUpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBnZXREYXRhPSgpPT57XG4gIGNvbnN0IGxvY2FsRGF0YT1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5EYXRhKTtcbiAgcmV0dXJuIGxvY2FsRGF0YS5ub3RlTGlzdDtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZU5vZGU9KG5vdGUsY2FsbGJhY2spPT57XG4gIGxldCBmaW5kTm9kZUluZGV4O1xuICBjb25zdCBmaW5kTm90ZT1Mb2NhbERhdGEubm90ZUxpc3QuZmluZChmdW5jdGlvbihpdGVtLGluZGV4KXtcbiAgICAgIGlmKGl0ZW0uaWQ9PW5vdGUuaWQpe1xuICAgICAgICBmaW5kTm9kZUluZGV4PWluZGV4O1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgaWYobm90ZS5kZWxldGUpe1xuICAgIExvY2FsRGF0YS5ub3RlTGlzdC5zcGxpY2UoZmluZE5vZGVJbmRleCwxKTtcbiAgfWVsc2UgaWYobm90ZS5kb25lKXtcbiAgICBkZWxldGUgZmluZE5vdGUucmVtaW5kVGltZTtcbiAgICBkZWxldGUgZmluZE5vdGUudXBkYXRlUmVtaW5kVGltZTtcbiAgfWVsc2V7XG4gICAgZm9yKHZhciBpIGluIG5vdGUpe1xuICAgICAgaWYoaSE9XCJpZFwiJiYobm90ZVtpXSE9dW5kZWZpbmVkKSl7XG4gICAgICAgIGZpbmROb3RlW2ldPW5vdGVbaV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX3NhdmVMb2NhbFRvU3RvcmFnZShmaW5kTm90ZSk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZE5vZGU9KG5vZGUsY2FsbGJhY2spPT57XG4gIGlmKCFub2RlLnRleHQpe3JldHVybjt9XG4gIG5vZGVbXCJpZFwiXT1fY3JlYXRlTm90ZUlkKCk7XG4gIExvY2FsRGF0YS5ub3RlTGlzdC51bnNoaWZ0KG5vZGUpO1xuICBfc2F2ZUxvY2FsVG9TdG9yYWdlKG5vZGUpO1xufVxuXG5leHBvcnQgY29uc3Qgb25Ob3RlTGlzdENoYW5nZT0oaGFuZGxlcik9PntcbiAgbm90ZUxpc3RIYW5kbGVyTGlzdC5wdXNoKGhhbmRsZXIpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5leHBvcnQgY29uc3QgRnVwZGF0ZU5vZGU9KCk9PntcbiAgcmV0dXJuIGZldGNoKHJlcXVlc3QucGF0aCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgLy9jcmVkZW50aWFsczogJ29taXQnLFxuICAgICAgICBjcmVkZW50aWFsczonaW5jbHVkZScsXG4gICAgICAgIGJvZHk6SlNPTi5zdHJpbmdpZnkocmVxdWVzdC5kYXRhKSxcbiAgICAgICAgaGVhZGVyczp7XG4gICAgICAgICAgICBcIlgtQ1NSRi1UT0tFTlwiOmNzcmZUb2tlbixcbiAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzKXtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90b29scy9zdG9yYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==