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

var _storage = __webpack_require__(42);

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
  if (!note.text) {
    LocalData.noteList.splice(findNodeIndex, 1);
  } else {
    for (var i in note) {
      if (i != "id" && note[i] != undefined) {
        findNote[i] = note[i];
      }
    }
    for (var i in findNote) {
      if (i != "id" && findNote[i] != undefined) {
        if (note[i]) {
          delete findNote[i];
        }
      }
    }
  }
  _saveLocalToStorage(note);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDQwZDM5N2NkNTJjZTM4YWVjNWY/YzcxOSIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdG9vbHMvc3RvcmFnZS5qcz81ODFhIl0sIm5hbWVzIjpbIk9ORV9NSU5VVEUiLCJjaHJvbWUiLCJicm93c2VyQWN0aW9uIiwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IiLCJjb2xvciIsInNldEJhZGdlVGV4dCIsInRleHQiLCJleHRlbnNpb24iLCJvbkNvbm5lY3QiLCJhZGRMaXN0ZW5lciIsInBvcnQiLCJjb25zb2xlIiwibG9nIiwib25NZXNzYWdlIiwibXNnIiwidHJpZ2dlck1zZyIsIldhdGNoRG9nIiwid2F0Y2hMaXN0IiwiYmFya0hhbmRsZXJzIiwidGltZW91dEludGVydmFsIiwicmVMb2FkTGlzdCIsImhhbmRsZXIiLCJwdXNoIiwibm93VGltZVN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJkYXRhIiwiYWxlcnROb3RlSWRzIiwiZmlsdGVyIiwiaXRlbSIsInJlbWluZFRpbWUiLCJpZCIsImxlbmd0aCIsIk9iamVjdCIsImtleXMiLCJzb3J0IiwiYSIsImIiLCJwYXJzZUludCIsIl9jaGVja01pblRpbWUiLCJtaW5SZW1pbmRUaW1lIiwic3VycGx1c1RpbWUiLCJpIiwidGVtcCIsImZvckVhY2giLCJzcGxpY2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiVGltZXJXYXRjaERvZyIsIm5ld1dhdGNoRG9nIiwib25EZXN0cm95Iiwib25CYXJrIiwibm90ZSIsIk1TR01hbmFnZSIsIlRZUEUiLCJMb2NhbERhdGEiLCJub3RlTGlzdEhhbmRsZXJMaXN0IiwibG9jYWxTdG9yYWdlIiwid2luZG93IiwiRGF0YSIsIkpTT04iLCJwYXJzZSIsIl9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlIiwibm9kZSIsIm5vdGVMaXN0IiwiX2NyZWF0ZU5vdGVJZCIsIl9zYXZlTG9jYWxUb1N0b3JhZ2UiLCJzdHJpbmdpZnkiLCJnZXREYXRhIiwibG9jYWxEYXRhIiwidXBkYXRlTm9kZSIsImNhbGxiYWNrIiwiZmluZE5vZGVJbmRleCIsImZpbmROb3RlIiwiZmluZCIsImluZGV4IiwidW5kZWZpbmVkIiwiYWRkTm9kZSIsInVuc2hpZnQiLCJvbk5vdGVMaXN0Q2hhbmdlIiwiRnVwZGF0ZU5vZGUiLCJmZXRjaCIsInJlcXVlc3QiLCJwYXRoIiwibWV0aG9kIiwiY3JlZGVudGlhbHMiLCJib2R5IiwiaGVhZGVycyIsImNzcmZUb2tlbiIsInRoZW4iLCJyZXMiLCJqc29uIiwiY2F0Y2giLCJlcnIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hFQTs7OztBQUNBLElBQU1BLGFBQVcsS0FBRyxJQUFwQjtBQUNBQyxPQUFPQyxhQUFQLENBQXFCQyx1QkFBckIsQ0FBNkMsRUFBRUMsT0FBTyxDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBVCxFQUE3QztBQUNBSCxPQUFPQyxhQUFQLENBQXFCRyxZQUFyQixDQUFrQyxFQUFDQyxNQUFLLEVBQU4sRUFBbEM7QUFDQUwsT0FBT00sU0FBUCxDQUFpQkMsU0FBakIsQ0FBMkJDLFdBQTNCLENBQXVD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U0FEWDtBQUVKLHNCQUFnQjtBQUZaO0FBTGEsR0FBcEIsRUFTRkMsSUFURSxDQVNHLFVBQVNDLEdBQVQsRUFBYztBQUNsQixXQUFPQSxJQUFJQyxJQUFKLEVBQVA7QUFDSCxHQVhJLEVBV0ZGLElBWEUsQ0FXRyxVQUFVQyxHQUFWLEVBQWMsQ0FDckIsQ0FaSSxFQVlGRSxLQVpFLENBWUksVUFBU0MsR0FBVCxFQUFjO0FBQ25CLFFBQUdBLEdBQUgsRUFBTztBQUNILFlBQU1BLEdBQU47QUFDSDtBQUNKLEdBaEJJLENBQVA7QUFpQkQsQ0FsQk0sQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNjIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ0MGQzOTdjZDUyY2UzOGFlYzVmIiwiaW1wb3J0IHtnZXREYXRhfSBmcm9tIFwiLi90b29scy9zdG9yYWdlXCJcbmNvbnN0IE9ORV9NSU5VVEU9MzAqMTAwMDtcbmNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlQmFja2dyb3VuZENvbG9yKHsgY29sb3I6IFsyNTUsIDAsIDAsIDI1NV19KTtcbmNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpcIlwifSk7XG5jaHJvbWUuZXh0ZW5zaW9uLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihmdW5jdGlvbihwb3J0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RlZCAuLi4uLlwiKTtcbiAgICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB0cmlnZ2VyTXNnKG1zZykgXG4gLy8gICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZShcIkhpIFBvcHVwLmpzXCIpO1xuICAgICAgfSk7XG59KVxuXG5jbGFzcyBXYXRjaERvZ3tcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLndhdGNoTGlzdD1bXTtcbiAgICB0aGlzLmJhcmtIYW5kbGVycz1bXTtcbiAgICB0aGlzLnRpbWVvdXRJbnRlcnZhbD1udWxsO1xuICAgIHRoaXMucmVMb2FkTGlzdCgpO1xuICB9XG4gIG9uRGVzdHJveSgpe1xuXG4gIH1cbiAgb25CYXJrKGhhbmRsZXIpe1xuICAgIHRoaXMuYmFya0hhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gIH1cbiAgcmVMb2FkTGlzdCgpe1xuICAgIGNvbnN0IG5vd1RpbWVTdGFtcD1uZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBjb25zdCBkYXRhPWdldERhdGEoKTtcbiAgICBhbGVydE5vdGVJZHM9e307XG4gICAgdGhpcy53YXRjaExpc3Q9ZGF0YS5maWx0ZXIoKGl0ZW0pPT57XG4gICAgICBpZihpdGVtLnJlbWluZFRpbWU+bm93VGltZVN0YW1wKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9ZWxzZSBpZihpdGVtLnJlbWluZFRpbWU8bm93VGltZVN0YW1wKXtcbiAgICAgICAgYWxlcnROb3RlSWRzW2l0ZW0uaWRdPWl0ZW07XG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGxlbmd0aD1PYmplY3Qua2V5cyhhbGVydE5vdGVJZHMpLmxlbmd0aDtcbiAgICBjb25zdCB0ZXh0PWxlbmd0aD9sZW5ndGgrXCJcIjpcIlwiO1xuICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDp0ZXh0fSk7XG5cbiAgICB0aGlzLndhdGNoTGlzdC5zb3J0KChhLGIpPT57XG4gICAgICByZXR1cm4gcGFyc2VJbnQoYS5yZW1pbmRUaW1lKT5wYXJzZUludChiLnJlbWluZFRpbWUpO1xuICAgIH0pO1xuICAgIHRoaXMuX2NoZWNrTWluVGltZSgpO1xuICB9XG4gIF9jaGVja01pblRpbWUoKXtcbiAgICBpZih0aGlzLndhdGNoTGlzdC5sZW5ndGg8MSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vd1RpbWVTdGFtcD1uZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBjb25zdCBtaW5SZW1pbmRUaW1lPXRoaXMud2F0Y2hMaXN0WzBdLnJlbWluZFRpbWU7XG4gICAgY29uc3Qgc3VycGx1c1RpbWU9bWluUmVtaW5kVGltZS1ub3dUaW1lU3RhbXA7XG4gICAgY29uc29sZS5sb2coc3VycGx1c1RpbWUvMjAwMCx0aGlzLndhdGNoTGlzdCk7XG4gICAgaWYoc3VycGx1c1RpbWU8MjAwMCl7Ly/lsI/kuo4z56eS77yM6Kem5Y+RXG4gICAgICBmb3IobGV0IGkgPTA7IGk8dGhpcy53YXRjaExpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCB0ZW1wPXRoaXMud2F0Y2hMaXN0W2ldO1xuICAgICAgICBpZih0ZW1wLnJlbWluZFRpbWUtMjAwMDxub3dUaW1lU3RhbXApe1xuICAgICAgICAgIHRoaXMuYmFya0hhbmRsZXJzLmZvckVhY2goKGl0ZW0pPT57XG4gICAgICAgICAgICBpdGVtKHRlbXApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMud2F0Y2hMaXN0LnNwbGljZShpLDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLl9jaGVja01pblRpbWUoKTtcbiAgICB9ZWxzZSB7XG4gICAgdGhpcy50aW1lb3V0SW50ZXJ2YWw/Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEludGVydmFsKTpcIlwiO1xuICAgIHRoaXMudGltZW91dEludGVydmFsPXNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgdGhpcy5fY2hlY2tNaW5UaW1lKCk7XG4gICAgICB9LHN1cnBsdXNUaW1lLzIpO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgVGltZXJXYXRjaERvZztcbmxldCBhbGVydE5vdGVJZHM9e307XG5cbmZ1bmN0aW9uIG5ld1dhdGNoRG9nKCl7XG4gIFRpbWVyV2F0Y2hEb2c9bmV3IFdhdGNoRG9nKCk7XG4gIFRpbWVyV2F0Y2hEb2cub25EZXN0cm95KCgpPT57XG5cbiAgfSk7XG4gIFRpbWVyV2F0Y2hEb2cub25CYXJrKChub3RlKT0+e1xuICAgIGFsZXJ0Tm90ZUlkc1tub3RlLmlkXT1ub3RlO1xuICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDogKE9iamVjdC5rZXlzKGFsZXJ0Tm90ZUlkcykubGVuZ3RoKStcIiBcIn0pO1xuICB9KTtcbn1cbm5ld1dhdGNoRG9nKCk7XG5cbmNvbnN0IE1TR01hbmFnZSA9IHtcbiAgXCJBRERfUkVNSU5EX1RJTUVcIihtc2cpe1xuICAgIGlmKCFUaW1lcldhdGNoRG9nKXtcbiAgICAgIG5ld1dhdGNoRG9nKCk7XG4gICAgfWVsc2V7XG4gICAgICBUaW1lcldhdGNoRG9nLnJlTG9hZExpc3QoKTtcbiAgICB9XG4gIH0sXG4gIFwiQ0xFQVJfUkVNSU5EXCIobXNnKXtcbiAgICBUaW1lcldhdGNoRG9nLnJlTG9hZExpc3QoKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHRyaWdnZXJNc2cobXNnKXtcbiAgTVNHTWFuYWdlW21zZy5UWVBFXT9NU0dNYW5hZ2VbbXNnLlRZUEVdKG1zZyk6XCJcIjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9iYWNrZ3JvdW5kLmpzIiwibGV0IExvY2FsRGF0YTtcbmxldCBub3RlTGlzdEhhbmRsZXJMaXN0PVtdO1xubGV0IGxvY2FsU3RvcmFnZT13aW5kb3cubG9jYWxTdG9yYWdlO1xuXG5pZighbG9jYWxTdG9yYWdlLkRhdGEpe1xuICBsb2NhbFN0b3JhZ2UuRGF0YT0ne1wibm90ZUxpc3RcIjpbXX0nO1xufVxuXG5Mb2NhbERhdGE9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuRGF0YSk7XG5cbmZ1bmN0aW9uIF9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlKG5vZGUpe1xuICBmb3IobGV0IGkgaW4gbm90ZUxpc3RIYW5kbGVyTGlzdCl7XG4gICAgbGV0IGhhbmRsZXI9bm90ZUxpc3RIYW5kbGVyTGlzdFtpXTtcbiAgICBoYW5kbGVyKG5vZGUsTG9jYWxEYXRhLm5vdGVMaXN0KTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIF9jcmVhdGVOb3RlSWQoKXtcbiAgY29uc3QgbGVuZ3RoPUxvY2FsRGF0YS5ub3RlTGlzdC5sZW5ndGg7XG4gIGNvbnN0IGlkPW5ldyBEYXRlKCkuZ2V0VGltZSgpK1wiX1wiK2xlbmd0aDtcbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiBfc2F2ZUxvY2FsVG9TdG9yYWdlKG5vZGUpe1xuICBsb2NhbFN0b3JhZ2UuRGF0YT1KU09OLnN0cmluZ2lmeShMb2NhbERhdGEpO1xuICBfZmlyZU5vdGVMaXN0SGFuZGxlclVwZGF0ZShub2RlKTtcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0RGF0YT0oKT0+e1xuICBjb25zdCBsb2NhbERhdGE9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuRGF0YSk7XG4gIHJldHVybiBsb2NhbERhdGEubm90ZUxpc3Q7XG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVOb2RlPShub3RlLGNhbGxiYWNrKT0+e1xuICBsZXQgZmluZE5vZGVJbmRleDtcbiAgY29uc3QgZmluZE5vdGU9TG9jYWxEYXRhLm5vdGVMaXN0LmZpbmQoZnVuY3Rpb24oaXRlbSxpbmRleCl7XG4gICAgICBpZihpdGVtLmlkPT1ub3RlLmlkKXtcbiAgICAgICAgZmluZE5vZGVJbmRleD1pbmRleDtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSk7XG4gIGlmKCFub3RlLnRleHQpe1xuICAgIExvY2FsRGF0YS5ub3RlTGlzdC5zcGxpY2UoZmluZE5vZGVJbmRleCwxKTtcbiAgfWVsc2V7XG4gICAgZm9yKHZhciBpIGluIG5vdGUpe1xuICAgICAgaWYoaSE9XCJpZFwiJiYobm90ZVtpXSE9dW5kZWZpbmVkKSl7XG4gICAgICAgIGZpbmROb3RlW2ldPW5vdGVbaV1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yKHZhciBpIGluIGZpbmROb3RlKXtcbiAgICAgIGlmKGkhPVwiaWRcIiYmKGZpbmROb3RlW2ldIT11bmRlZmluZWQpKXtcbiAgICAgICAgaWYobm90ZVtpXSl7XG4gICAgICAgICAgZGVsZXRlIGZpbmROb3RlW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9zYXZlTG9jYWxUb1N0b3JhZ2Uobm90ZSk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZE5vZGU9KG5vZGUsY2FsbGJhY2spPT57XG4gIGlmKCFub2RlLnRleHQpe3JldHVybjt9XG4gIG5vZGVbXCJpZFwiXT1fY3JlYXRlTm90ZUlkKCk7XG4gIExvY2FsRGF0YS5ub3RlTGlzdC51bnNoaWZ0KG5vZGUpO1xuICBfc2F2ZUxvY2FsVG9TdG9yYWdlKG5vZGUpO1xufVxuXG5leHBvcnQgY29uc3Qgb25Ob3RlTGlzdENoYW5nZT0oaGFuZGxlcik9PntcbiAgbm90ZUxpc3RIYW5kbGVyTGlzdC5wdXNoKGhhbmRsZXIpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5leHBvcnQgY29uc3QgRnVwZGF0ZU5vZGU9KCk9PntcbiAgcmV0dXJuIGZldGNoKHJlcXVlc3QucGF0aCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgLy9jcmVkZW50aWFsczogJ29taXQnLFxuICAgICAgICBjcmVkZW50aWFsczonaW5jbHVkZScsXG4gICAgICAgIGJvZHk6SlNPTi5zdHJpbmdpZnkocmVxdWVzdC5kYXRhKSxcbiAgICAgICAgaGVhZGVyczp7XG4gICAgICAgICAgICBcIlgtQ1NSRi1UT0tFTlwiOmNzcmZUb2tlbixcbiAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzKXtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90b29scy9zdG9yYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==