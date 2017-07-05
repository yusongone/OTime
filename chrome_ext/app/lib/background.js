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
/******/ 	return __webpack_require__(__webpack_require__.s = 284);
/******/ })
/************************************************************************/
/******/ ({

/***/ 284:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = __webpack_require__(59);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ONE_MINUTE = 30 * 1000;
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

/*
  var i=0;
  setInterval(function(){
    chrome.browserAction.setBadgeText({text: (i++)+" "});

  },3000);
*/

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
      this.watchList = data.filter(function (item) {
        if (item.remindTime > nowTimeStamp) {
          return true;
        }
      });
      this.watchList.sort(function (a, b) {
        return parseInt(a.remindTime) > parseInt(b.remindTime);
      });
      console.log(data, this.watchList);
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
      console.log(surplusTime / 1000 / 2, this.watchList);
      if (surplusTime < 2000) {
        var _loop = function _loop(i) {
          var temp = _this.watchList[i];
          if (temp.remindTime - 2000 > nowTimeStamp) {
            console.log("-------", temp, barkHandlers);
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

var TimerWatchDog = new WatchDog();
var alertCount = 0;

var MSGManage = {
  "ADD_REMIND_TIME": function ADD_REMIND_TIME(msg) {
    if (!TimerWatchDog) {
      TimerWatchDog = new WatchDog();
      TimerWatchDog.onDestroy(function () {});
      TimerWatchDog.onBark(function () {
        alertCount++;
        console.log("onbark");
        chrome.browserAction.setBadgeText({ text: alertCount + " " });
      });
    } else {
      TimerWatchDog.reLoadList();
    }
  }
};

chrome.extension.onConnect.addListener(function (port) {
  console.log("Connected .....");
  port.onMessage.addListener(function (msg) {
    triggerMsg(msg
    //          port.postMessage("Hi Popup.js");
    );
  });
});

function triggerMsg(msg) {
  MSGManage[msg.TYPE] ? MSGManage[msg.TYPE](msg) : "";
}

/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//import SQL from "./localSql"


var LocalData = void 0;
var noteListHandlerList = [];
var localStorage = window.localStorage;

if (!localStorage.Data) {
  localStorage.Data = '{"noteList":[]}';
}
LocalData = JSON.parse(localStorage.Data);

function _fireNoteListHandlerUpdate() {
  for (var i in noteListHandlerList) {
    var handler = noteListHandlerList[i];
    handler(LocalData.noteList);
  }
}

function _createNoteId() {
  var length = LocalData.noteList.length;
  var id = new Date().getTime() + "_" + length;
  return id;
}

function _saveLocalToStorage() {
  localStorage.Data = JSON.stringify(LocalData);
  _fireNoteListHandlerUpdate();
}

var getData = exports.getData = function getData() {
  return LocalData.noteList;
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
  }

  _saveLocalToStorage();
};

var addNode = exports.addNode = function addNode(node, callback) {
  if (!node.text) {
    return;
  }
  node["id"] = _createNoteId();
  LocalData.noteList.unshift(node);
  _saveLocalToStorage();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDk1ZGUyZTdlODc3MzgxYjgyMjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2xzL3N0b3JhZ2UuanMiXSwibmFtZXMiOlsiT05FX01JTlVURSIsImNocm9tZSIsImJyb3dzZXJBY3Rpb24iLCJzZXRCYWRnZUJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiV2F0Y2hEb2ciLCJ3YXRjaExpc3QiLCJiYXJrSGFuZGxlcnMiLCJ0aW1lb3V0SW50ZXJ2YWwiLCJyZUxvYWRMaXN0IiwiaGFuZGxlciIsInB1c2giLCJub3dUaW1lU3RhbXAiLCJEYXRlIiwiZ2V0VGltZSIsImRhdGEiLCJmaWx0ZXIiLCJpdGVtIiwicmVtaW5kVGltZSIsInNvcnQiLCJhIiwiYiIsInBhcnNlSW50IiwiY29uc29sZSIsImxvZyIsIl9jaGVja01pblRpbWUiLCJsZW5ndGgiLCJtaW5SZW1pbmRUaW1lIiwic3VycGx1c1RpbWUiLCJpIiwidGVtcCIsImZvckVhY2giLCJzcGxpY2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiVGltZXJXYXRjaERvZyIsImFsZXJ0Q291bnQiLCJNU0dNYW5hZ2UiLCJtc2ciLCJvbkRlc3Ryb3kiLCJvbkJhcmsiLCJzZXRCYWRnZVRleHQiLCJ0ZXh0IiwiZXh0ZW5zaW9uIiwib25Db25uZWN0IiwiYWRkTGlzdGVuZXIiLCJwb3J0Iiwib25NZXNzYWdlIiwidHJpZ2dlck1zZyIsIlRZUEUiLCJMb2NhbERhdGEiLCJub3RlTGlzdEhhbmRsZXJMaXN0IiwibG9jYWxTdG9yYWdlIiwid2luZG93IiwiRGF0YSIsIkpTT04iLCJwYXJzZSIsIl9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlIiwibm90ZUxpc3QiLCJfY3JlYXRlTm90ZUlkIiwiaWQiLCJfc2F2ZUxvY2FsVG9TdG9yYWdlIiwic3RyaW5naWZ5IiwiZ2V0RGF0YSIsInVwZGF0ZU5vZGUiLCJub3RlIiwiY2FsbGJhY2siLCJmaW5kTm9kZUluZGV4IiwiZmluZE5vdGUiLCJmaW5kIiwiaW5kZXgiLCJ1bmRlZmluZWQiLCJhZGROb2RlIiwibm9kZSIsInVuc2hpZnQiLCJvbk5vdGVMaXN0Q2hhbmdlIiwiRnVwZGF0ZU5vZGUiLCJmZXRjaCIsInJlcXVlc3QiLCJwYXRoIiwibWV0aG9kIiwiY3JlZGVudGlhbHMiLCJib2R5IiwiaGVhZGVycyIsImNzcmZUb2tlbiIsInRoZW4iLCJyZXMiLCJqc29uIiwiY2F0Y2giLCJlcnIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hFQTs7OztBQUNBLElBQU1BLGFBQVcsS0FBRyxJQUFwQjtBQUNBQyxPQUFPQyxhQUFQLENBQXFCQyx1QkFBckIsQ0FBNkMsRUFBRUMsT0FBTyxDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBVCxFQUE3Qzs7QUFFQTs7Ozs7Ozs7SUFRTUMsUTtBQUNKLHNCQUFhO0FBQUE7O0FBQ1gsU0FBS0MsU0FBTCxHQUFlLEVBQWY7QUFDQSxTQUFLQyxZQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsZUFBTCxHQUFxQixJQUFyQjtBQUNBLFNBQUtDLFVBQUw7QUFDRDs7OztnQ0FDVSxDQUVWOzs7MkJB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TWtFLG9DQUFZLFNBQVpBLFdBQVksR0FBSTtBQUMzQixTQUFPQyxNQUFNQyxRQUFRQyxJQUFkLEVBQW9CO0FBQ3JCQyxZQUFRLE1BRGE7QUFFckI7QUFDQUMsaUJBQVksU0FIUztBQUlyQkMsVUFBSzNCLEtBQUtPLFNBQUwsQ0FBZWdCLFFBQVEvRCxJQUF2QixDQUpnQjtBQUtyQm9FLGFBQVE7QUFDSixzQkFBZUMsU0FEWDtBQUVKLHNCQUFnQjtBQUZaO0FBTGEsR0FBcEIsRUFTRkMsSUFURSxDQVNHLFVBQVNDLEdBQVQsRUFBYztBQUNsQixXQUFPQSxJQUFJQyxJQUFKLEVBQVA7QUFDSCxHQVhJLEVBV0ZGLElBWEUsQ0FXRyxVQUFVQyxHQUFWLEVBQWMsQ0FDckIsQ0FaSSxFQVlGRSxLQVpFLENBWUksVUFBU0MsR0FBVCxFQUFjO0FBQ25CLFFBQUdBLEdBQUgsRUFBTztBQUNILFlBQU1BLEdBQU47QUFDSDtBQUNKLEdBaEJJLENBQVA7QUFpQkQsQ0FsQk0sQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyODQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ5NWRlMmU3ZTg3NzM4MWI4MjIyIiwiaW1wb3J0IHtnZXREYXRhfSBmcm9tIFwiLi90b29scy9zdG9yYWdlXCJcbmNvbnN0IE9ORV9NSU5VVEU9MzAqMTAwMDtcbmNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlQmFja2dyb3VuZENvbG9yKHsgY29sb3I6IFsyNTUsIDAsIDAsIDI1NV19KTtcblxuLypcbiAgdmFyIGk9MDtcbiAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6IChpKyspK1wiIFwifSk7XG5cbiAgfSwzMDAwKTtcbiovXG5cbmNsYXNzIFdhdGNoRG9ne1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMud2F0Y2hMaXN0PVtdO1xuICAgIHRoaXMuYmFya0hhbmRsZXJzPVtdO1xuICAgIHRoaXMudGltZW91dEludGVydmFsPW51bGw7XG4gICAgdGhpcy5yZUxvYWRMaXN0KCk7XG4gIH1cbiAgb25EZXN0cm95KCl7XG5cbiAgfVxuICBvbkJhcmsoaGFuZGxlcil7XG4gICAgdGhpcy5iYXJrSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgfVxuICByZUxvYWRMaXN0KCl7XG4gICAgY29uc3Qgbm93VGltZVN0YW1wPW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IGRhdGE9Z2V0RGF0YSgpO1xuICAgIHRoaXMud2F0Y2hMaXN0PWRhdGEuZmlsdGVyKChpdGVtKT0+e1xuICAgICAgaWYoaXRlbS5yZW1pbmRUaW1lPm5vd1RpbWVTdGFtcCl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy53YXRjaExpc3Quc29ydCgoYSxiKT0+e1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGEucmVtaW5kVGltZSk+cGFyc2VJbnQoYi5yZW1pbmRUaW1lKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhkYXRhLHRoaXMud2F0Y2hMaXN0KTtcbiAgICB0aGlzLl9jaGVja01pblRpbWUoKTtcbiAgfVxuICBfY2hlY2tNaW5UaW1lKCl7XG4gICAgaWYodGhpcy53YXRjaExpc3QubGVuZ3RoPDEpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub3dUaW1lU3RhbXA9bmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgY29uc3QgbWluUmVtaW5kVGltZT10aGlzLndhdGNoTGlzdFswXS5yZW1pbmRUaW1lO1xuICAgIGNvbnN0IHN1cnBsdXNUaW1lPW1pblJlbWluZFRpbWUtbm93VGltZVN0YW1wO1xuICAgIGNvbnNvbGUubG9nKHN1cnBsdXNUaW1lLzEwMDAvMix0aGlzLndhdGNoTGlzdCk7XG4gICAgaWYoc3VycGx1c1RpbWU8MjAwMCl7Ly/lsI/kuo4z56eS77yM6Kem5Y+RXG4gICAgICBmb3IobGV0IGkgPTA7IGk8dGhpcy53YXRjaExpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCB0ZW1wPXRoaXMud2F0Y2hMaXN0W2ldO1xuICAgICAgICBpZih0ZW1wLnJlbWluZFRpbWUtMjAwMD5ub3dUaW1lU3RhbXApe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLVwiLHRlbXAsYmFya0hhbmRsZXJzKTtcbiAgICAgICAgICB0aGlzLmJhcmtIYW5kbGVycy5mb3JFYWNoKChpdGVtKT0+e1xuICAgICAgICAgICAgaXRlbSh0ZW1wKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLndhdGNoTGlzdC5zcGxpY2UoaSwxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fY2hlY2tNaW5UaW1lKCk7XG4gICAgfWVsc2Uge1xuICAgIHRoaXMudGltZW91dEludGVydmFsP2NsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJbnRlcnZhbCk6XCJcIjtcbiAgICB0aGlzLnRpbWVvdXRJbnRlcnZhbD1zZXRUaW1lb3V0KCgpPT57XG4gICAgICAgIHRoaXMuX2NoZWNrTWluVGltZSgpO1xuICAgICAgfSxzdXJwbHVzVGltZS8yKTtcbiAgICB9XG4gIH1cbn1cblxubGV0IFRpbWVyV2F0Y2hEb2c9bmV3IFdhdGNoRG9nKCk7XG5sZXQgYWxlcnRDb3VudD0wO1xuXG5jb25zdCBNU0dNYW5hZ2UgPSB7XG4gIFwiQUREX1JFTUlORF9USU1FXCIobXNnKXtcbiAgICBpZighVGltZXJXYXRjaERvZyl7XG4gICAgICBUaW1lcldhdGNoRG9nPW5ldyBXYXRjaERvZygpO1xuICAgICAgVGltZXJXYXRjaERvZy5vbkRlc3Ryb3koKCk9PntcblxuICAgICAgfSk7XG4gICAgICBUaW1lcldhdGNoRG9nLm9uQmFyaygoKT0+e1xuICAgICAgICBhbGVydENvdW50Kys7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib25iYXJrXCIpO1xuICAgICAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6IChhbGVydENvdW50KStcIiBcIn0pO1xuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICBUaW1lcldhdGNoRG9nLnJlTG9hZExpc3QoKTtcbiAgICB9XG4gIH1cbn1cblxuY2hyb21lLmV4dGVuc2lvbi5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24ocG9ydCkge1xuICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0ZWQgLi4uLi5cIik7XG4gICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgdHJpZ2dlck1zZyhtc2cpIFxuIC8vICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UoXCJIaSBQb3B1cC5qc1wiKTtcbiAgICAgIH0pO1xufSlcblxuZnVuY3Rpb24gdHJpZ2dlck1zZyhtc2cpe1xuICBNU0dNYW5hZ2VbbXNnLlRZUEVdP01TR01hbmFnZVttc2cuVFlQRV0obXNnKTpcIlwiO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2JhY2tncm91bmQuanMiLCIvL2ltcG9ydCBTUUwgZnJvbSBcIi4vbG9jYWxTcWxcIlxuXG5cbmxldCBMb2NhbERhdGE7XG5sZXQgbm90ZUxpc3RIYW5kbGVyTGlzdD1bXTtcbmxldCBsb2NhbFN0b3JhZ2U9d2luZG93LmxvY2FsU3RvcmFnZTtcblxuaWYoIWxvY2FsU3RvcmFnZS5EYXRhKXtcbiAgbG9jYWxTdG9yYWdlLkRhdGE9J3tcIm5vdGVMaXN0XCI6W119Jztcbn1cbkxvY2FsRGF0YT1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5EYXRhKTtcblxuZnVuY3Rpb24gX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUoKXtcbiAgZm9yKGxldCBpIGluIG5vdGVMaXN0SGFuZGxlckxpc3Qpe1xuICAgIGxldCBoYW5kbGVyPW5vdGVMaXN0SGFuZGxlckxpc3RbaV07XG4gICAgaGFuZGxlcihMb2NhbERhdGEubm90ZUxpc3QpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gX2NyZWF0ZU5vdGVJZCgpe1xuICBjb25zdCBsZW5ndGg9TG9jYWxEYXRhLm5vdGVMaXN0Lmxlbmd0aDtcbiAgY29uc3QgaWQ9bmV3IERhdGUoKS5nZXRUaW1lKCkrXCJfXCIrbGVuZ3RoO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIF9zYXZlTG9jYWxUb1N0b3JhZ2UoKXtcbiAgbG9jYWxTdG9yYWdlLkRhdGE9SlNPTi5zdHJpbmdpZnkoTG9jYWxEYXRhKTtcbiAgX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUoKTtcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0RGF0YT0oKT0+e1xuICByZXR1cm4gTG9jYWxEYXRhLm5vdGVMaXN0O1xufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlTm9kZT0obm90ZSxjYWxsYmFjayk9PntcbiAgbGV0IGZpbmROb2RlSW5kZXg7XG4gIGNvbnN0IGZpbmROb3RlPUxvY2FsRGF0YS5ub3RlTGlzdC5maW5kKGZ1bmN0aW9uKGl0ZW0saW5kZXgpe1xuICAgICAgaWYoaXRlbS5pZD09bm90ZS5pZCl7XG4gICAgICAgIGZpbmROb2RlSW5kZXg9aW5kZXg7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICBpZighbm90ZS50ZXh0KXtcbiAgICBMb2NhbERhdGEubm90ZUxpc3Quc3BsaWNlKGZpbmROb2RlSW5kZXgsMSk7XG4gIH1lbHNle1xuICAgIGZvcih2YXIgaSBpbiBub3RlKXtcbiAgICAgIGlmKGkhPVwiaWRcIiYmKG5vdGVbaV0hPXVuZGVmaW5lZCkpe1xuICAgICAgICBmaW5kTm90ZVtpXT1ub3RlW2ldXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3NhdmVMb2NhbFRvU3RvcmFnZSgpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhZGROb2RlPShub2RlLGNhbGxiYWNrKT0+e1xuICBpZighbm9kZS50ZXh0KXtyZXR1cm47fVxuICBub2RlW1wiaWRcIl09X2NyZWF0ZU5vdGVJZCgpO1xuICBMb2NhbERhdGEubm90ZUxpc3QudW5zaGlmdChub2RlKTtcbiAgX3NhdmVMb2NhbFRvU3RvcmFnZSgpO1xufVxuXG5leHBvcnQgY29uc3Qgb25Ob3RlTGlzdENoYW5nZT0oaGFuZGxlcik9PntcbiAgbm90ZUxpc3RIYW5kbGVyTGlzdC5wdXNoKGhhbmRsZXIpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5leHBvcnQgY29uc3QgRnVwZGF0ZU5vZGU9KCk9PntcbiAgcmV0dXJuIGZldGNoKHJlcXVlc3QucGF0aCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgLy9jcmVkZW50aWFsczogJ29taXQnLFxuICAgICAgICBjcmVkZW50aWFsczonaW5jbHVkZScsXG4gICAgICAgIGJvZHk6SlNPTi5zdHJpbmdpZnkocmVxdWVzdC5kYXRhKSxcbiAgICAgICAgaGVhZGVyczp7XG4gICAgICAgICAgICBcIlgtQ1NSRi1UT0tFTlwiOmNzcmZUb2tlbixcbiAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzKXtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90b29scy9zdG9yYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==