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
/******/ 	return __webpack_require__(__webpack_require__.s = 160);
/******/ })
/************************************************************************/
/******/ ({

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = __webpack_require__(40);

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

/***/ 40:
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
    for (var i in findNote) {
      if (i != "id" && note[i] != undefined) {
        findNote[i] = note[i];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzVhZWM4NTY2NDY0NWI0M2VmZjUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2xzL3N0b3JhZ2UuanMiXSwibmFtZXMiOlsiT05FX01JTlVURSIsImNocm9tZSIsImJyb3dzZXJBY3Rpb24iLCJzZXRCYWRnZUJhY2tncm91bmRDb2xvciIsImNvbG9yIiwic2V0QmFkZ2VUZXh0IiwidGV4dCIsImV4dGVuc2lvbiIsIm9uQ29ubmVjdCIsImFkZExpc3RlbmVyIiwicG9ydCIsImNvbnNvbGUiLCJsb2ciLCJvbk1lc3NhZ2UiLCJtc2ciLCJ0cmlnZ2VyTXNnIiwiV2F0Y2hEb2ciLCJ3YXRjaExpc3QiLCJiYXJrSGFuZGxlcnMiLCJ0aW1lb3V0SW50ZXJ2YWwiLCJyZUxvYWRMaXN0IiwiaGFuZGxlciIsInB1c2giLCJub3dUaW1lU3RhbXAiLCJEYXRlIiwiZ2V0VGltZSIsImRhdGEiLCJhbGVydE5vdGVJZHMiLCJmaWx0ZXIiLCJpdGVtIiwicmVtaW5kVGltZSIsImlkIiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInNvcnQiLCJhIiwiYiIsInBhcnNlSW50IiwiX2NoZWNrTWluVGltZSIsIm1pblJlbWluZFRpbWUiLCJzdXJwbHVzVGltZSIsImkiLCJ0ZW1wIiwiZm9yRWFjaCIsInNwbGljZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJUaW1lcldhdGNoRG9nIiwibmV3V2F0Y2hEb2ciLCJvbkRlc3Ryb3kiLCJvbkJhcmsiLCJub3RlIiwiTVNHTWFuYWdlIiwiVFlQRSIsIkxvY2FsRGF0YSIsIm5vdGVMaXN0SGFuZGxlckxpc3QiLCJsb2NhbFN0b3JhZ2UiLCJ3aW5kb3ciLCJEYXRhIiwiSlNPTiIsInBhcnNlIiwiX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUiLCJub2RlIiwibm90ZUxpc3QiLCJfY3JlYXRlTm90ZUlkIiwiX3NhdmVMb2NhbFRvU3RvcmFnZSIsInN0cmluZ2lmeSIsImdldERhdGEiLCJsb2NhbERhdGEiLCJ1cGRhdGVOb2RlIiwiY2FsbGJhY2siLCJmaW5kTm9kZUluZGV4IiwiZmluZE5vdGUiLCJmaW5kIiwiaW5kZXgiLCJ1bmRlZmluZWQiLCJhZGROb2RlIiwidW5zaGlmdCIsIm9uTm90ZUxpc3RDaGFuZ2UiLCJGdXBkYXRlTm9kZSIsImZldGNoIiwicmVxdWVzdCIsInBhdGgiLCJtZXRob2QiLCJjcmVkZW50aWFscyIsImJvZHkiLCJoZWFkZXJzIiwiY3NyZlRva2VuIiwidGhlbiIsInJlcyIsImpzb24iLCJjYXRjaCIsImVyciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEVBOzs7O0FBQ0EsSUFBTUEsYUFBVyxLQUFHLElBQXBCO0FBQ0FDLE9BQU9DLGFBQVAsQ0FBcUJDLHVCQUFyQixDQUE2QyxFQUFFQyxPQUFPLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxDQUFULEVBQVksR0FBWixDQUFULEVBQTdDO0FBQ0FILE9BQU9DLGFBQVAsQ0FBcUJHLFlBQXJCLENBQWtDLEVBQUNDLE1BQUssRUFBTixFQUFsQztBQUNBTCxPQUFPTSxTQUFQLENBQWlCQyxTQUFqQixDQUEyQkMsV0FBM0IsQ0FBdUMsVUFBU0MsSUFBVCxFQUFlO0FBQ2hEQyxVQUFRQyxHQUFSLENBQVksaUJBQVo7QUFDQUYsT0FBS0csU0FBTCxDQUFlSixXQUFmLENBQTJCLFVBQVNLLEdBQVQsRUFBYztBQUN2Q0gsWUFBUUMsR0FBUixDQUFZRSxHQUFaO0FBQ0FDLGVBQVdELEdBQVg7QUFDUDtBQUNNLEdBSkQ7QUFLTCxDQVBEOztJQVNNRSxRO0FBQ0osc0JBQWE7QUFBQTs7QUFDWCxTQUFLQyxTQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLFlBQUwsR0FBa0IsRUFBbEI7QUFDQSxTQUFLQyxlQUFMLEdBQXFCLElBQXJCO0FBQ0EsU0FBS0MsVUFBTDtBQUNEOzs7O2dDQUNVLENBRVY7OzsyQkFDTUMsTyxFQUFRO0FBQ2IsV0FBS0gsWUFBTCxDQUFrQkksSUFBbEIsQ0FBdUJELE9BQXZCO0FBQ0Q7OztpQ0FDVztBQUNWLFVBQU1FLGVBQWEsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQW5CO0FBQ0EsVUFBTUMsT0FBSyx1QkFBWDtBQUNBQyxxQkFBYSxFQUFiO0FBQ0EsV0FBS1YsU0FBTCxHQUFlUyxLQUFLRSxNQUFMLENBQVksVUFBQ0MsSUFBRCxFQUFRO0FBQ2pDLFlBQUdBLEtBQUtDLFVBQUwsR0FBZ0JQLFlBQW5CLEVBQWdDO0FBQzlCLGlCQUFPLElBQVA7QUFDRCxTQUZELE1BRU0sSUFBR00sS0FBS0MsVUFBTCxHQUFnQlAsWUFBbkIsRUFBZ0M7QUFDcENJLHVCQUFhRSxLQUFLRSxFQUFsQixJQUFzQkYsSUFBdEI7QUFDRDtBQUNGLE9BTmMsQ0FBZjs7QUFRQSxVQUFNRyxTQUFPQyxPQUFPQyxJQUFQLENBQVlQLFlBQVosRUFBMEJLLE1BQXZDO0FBQ0EsVUFBTTFCLE9BQUswQixTQUFPQSxTQUFPLEVBQWQsR0FBaUIsRUFBNUI7QUFDQS9CLGFBQU9DLGFBQVAsQ0FBcUJHLFlBQXJCLENBQWtDLEVBQUNDLE1BQUtBLElBQU4sRUFBbEM7O0FBRUEsV0FBS1csU0FBTCxDQUFla0IsSUFBZixDQUFvQixVQUFDQyxDQUFELEVBQUdDLENBQUgsRUFBTztBQUN6QixlQUFPQyxTQUFTRixFQUFFTixVQUFYLElBQXVCUSxTQUFTRCxFQUFFUCxVQUFYLENBQTlCO0FBQ0QsT0FGRDtBQUdBLFdBQUtTLGFBQUw7QUFDRDs7O29DQUNjO0FBQUE7O0FBQ2IsVUFBRyxLQUFLdEIsU0FBTCxDQUFlZSxNQUFmLEdBQXNCLENBQXpCLEVBQTJCO0FBQ3pCO0FBQ0Q7QUFDRCxVQUFNVCxlQUFhLElBQUlDLElBQUosR0FBV0MsT0FBWCxFQUFuQjtBQUNBLFVBQU1lLGdCQUFjLEtBQUt2QixTQUFMLENBQWUsQ0FBZixFQUFrQmEsVUFBdEM7QUFDQSxVQUFNVyxjQUFZRCxnQkFBY2pCLFlBQWhDO0FBQ0FaLGNBQVFDLEdBQVIsQ0FBWTZCLGNBQVksSUFBeEIsRUFBNkIsS0FBS3hCLFNBQWxDO0FBQ0EsVUFBR3dCLGNBQVksSUFBZixFQUFvQjtBQUFBLG1DQUNWQyxDQURVO0FBRWhCLGNBQUlDLE9BQUssTUFBSzFCLFNBQUwsQ0FBZXlCLENBQWYsQ0FBVDtBQUNBLGNBQUdDLEtBQUtiLFVBQUwsR0FBZ0IsSUFBaEIsR0FBcUJQLFlBQXhCLEVBQXFDO0FBQ25DLGtCQUFLTCxZQUFMLENBQWtCMEIsT0FBbEIsQ0FBMEIsVUFBQ2YsSUFBRCxFQUFRO0FBQ2hDQSxtQkFBS2MsSUFBTDtBQUNELGFBRkQ7QUFHQSxrQkFBSzFCLFNBQUwsQ0FBZTRCLE1BQWYsQ0FBc0JILENBQXRCLEVBQXdCLENBQXhCO0FBQ0Q7QUFSZTs7QUFBQztBQUNuQixhQUFJLElBQUlBLElBQUcsQ0FBWCxFQUFjQSxJQUFFLEtBQUt6QixTQUFMLENBQWVlLE1BQS9CLEVBQXNDVSxHQUF0QyxFQUEwQztBQUFBLGdCQUFsQ0EsQ0FBa0M7QUFRekM7QUFDRCxhQUFLSCxhQUFMO0FBQ0QsT0FYRCxNQVdNO0FBQ04sYUFBS3BCLGVBQUwsR0FBcUIyQixhQUFhLEtBQUszQixlQUFsQixDQUFyQixHQUF3RCxFQUF4RDtBQUNBLGFBQUtBLGVBQUwsR0FBcUI0QixXQUFXLFlBQUk7QUFDaEMsZ0JBQUtSLGFBQUw7QUFDRCxTQUZrQixFQUVqQkUsY0FBWSxDQUZLLENBQXJCO0FBR0M7QUFDRjs7Ozs7O0FBR0gsSUFBSU8sc0JBQUo7QUFDQSxJQUFJckIsZUFBYSxFQUFqQjs7QUFFQSxTQUFTc0IsV0FBVCxHQUFzQjtBQUNwQkQsa0JBQWMsSUFBSWhDLFFBQUosRUFBZDtBQUNBZ0MsZ0JBQWNFLFNBQWQsQ0FBd0IsWUFBSSxDQUUzQixDQUZEO0FBR0FGLGdCQUFjRyxNQUFkLENBQXFCLFVBQUNDLElBQUQsRUFBUTtBQUMzQnpCLGlCQUFheUIsS0FBS3JCLEVBQWxCLElBQXNCcUIsSUFBdEI7QUFDQW5ELFdBQU9DLGFBQVAsQ0FBcUJHLFlBQXJCLENBQWtDLEVBQUNDLE1BQU8yQixPQUFPQyxJQUFQLENBQVlQLFlBQVosRUFBMEJLLE1BQTNCLEdBQW1DLEdBQTFDLEVBQWxDO0FBQ0QsR0FIRDtBQUlEO0FBQ0RpQjs7QUFFQSxJQUFNSSxZQUFZO0FBQ2hCLG1CQURnQiwyQkFDRXZDLEdBREYsRUFDTTtBQUNwQixRQUFHLENBQUNrQyxhQUFKLEVBQWtCO0FBQ2hCQztBQUNELEtBRkQsTUFFSztBQUNIRCxvQkFBYzVCLFVBQWQ7QUFDRDtBQUNGLEdBUGU7QUFRaEIsZ0JBUmdCLHdCQVFETixHQVJDLEVBUUc7QUFDakJrQyxrQkFBYzVCLFVBQWQ7QUFDRDtBQVZlLENBQWxCOztBQWNBLFNBQVNMLFVBQVQsQ0FBb0JELEdBQXBCLEVBQXdCO0FBQ3RCdUMsWUFBVXZDLElBQUl3QyxJQUFkLElBQW9CRCxVQUFVdkMsSUFBSXdDLElBQWQsRUFBb0J4QyxHQUFwQixDQUFwQixHQUE2QyxFQUE3QztBQUNELEM7Ozs7Ozs7Ozs7Ozs7QUMxR0QsSUFBSXlDLGtCQUFKO0FBQ0EsSUFBSUMsc0JBQW9CLEVBQXhCO0FBQ0EsSUFBSUMsZUFBYUMsT0FBT0QsWUFBeEI7O0FBRUEsSUFBRyxDQUFDQSxhQUFhRSxJQUFqQixFQUFzQjtBQUNwQkYsZUFBYUUsSUFBYixHQUFrQixpQkFBbEI7QUFDRDs7QUFFREosWUFBVUssS0FBS0MsS0FBTCxDQUFXSixhQUFhRSxJQUF4QixDQUFWOztBQUVBLFNBQVNHLDBCQUFULENBQW9DQyxJQUFwQyxFQUF5QztBQUN2QyxPQUFJLElBQUlyQixDQUFSLElBQWFjLG1CQUFiLEVBQWlDO0FBQy9CLFFBQUluQyxVQUFRbUMsb0JBQW9CZCxDQUFwQixDQUFaO0FBQ0FyQixZQUFRMEMsSUFBUixFQUFhUixVQUFVUyxRQUF2QjtBQUNEO0FBQ0Y7O0FBR0QsU0FBU0MsYUFBVCxHQUF3QjtBQUN0QixNQUFNakMsU0FBT3VCLFVBQVVTLFFBQVYsQ0FBbUJoQyxNQUFoQztBQUNBLE1BQU1ELEtBQUcsSUFBSVAsSUFBSixHQUFXQyxPQUFYLEtBQXFCLEdBQXJCLEdBQXlCTyxNQUFsQztBQUNBLFNBQU9ELEVBQVA7QUFDRDs7QUFFRCxTQUFTbUMsbUJBQVQsQ0FBNkJILElBQTdCLEVBQWtDO0FBQ2hDTixlQUFhRSxJQUFiLEdBQWtCQyxLQUFLTyxTQUFMLENBQWVaLFNBQWYsQ0FBbEI7QUFDQU8sNkJBQTJCQyxJQUEzQjtBQUNEOztBQUdNLElBQU1LLDRCQUFRLFNBQVJBLE9BQVEsR0FBSTtBQUN2QixNQUFNQyxZQUFVVCxLQUFLQyxLQUFMLENBQVdKLGFBQWFFLElBQXhCLENBQWhCO0FBQ0EsU0FBT1UsVUFBVUwsUUFBakI7QUFDRCxDQUhNOztBQUtBLElBQU1NLGtDQUFXLFNBQVhBLFVBQVcsQ0FBQ2xCLElBQUQsRUFBTW1CLFFBQU4sRUFBaUI7QUFDdkMsTUFBSUMsc0JBQUo7QUFDQSxNQUFNQyxXQUFTbEIsVUFBVVMsUUFBVixDQUFtQlUsSUFBbkIsQ0FBd0IsVUFBUzdDLElBQVQsRUFBYzhDLEtBQWQsRUFBb0I7QUFDdkQsUUFBRzlDLEtBQUtFLEVBQUwsSUFBU3FCLEtBQUtyQixFQUFqQixFQUFvQjtBQUNsQnlDLHNCQUFjRyxLQUFkO0FBQ0EsYUFBTzlDLElBQVA7QUFDRDtBQUNGLEdBTFksQ0FBZjtBQU1BLE1BQUcsQ0FBQ3VCLEtBQUs5QyxJQUFULEVBQWM7QUFDWmlELGNBQVVTLFFBQVYsQ0FBbUJuQixNQUFuQixDQUEwQjJCLGFBQTFCLEVBQXdDLENBQXhDO0FBQ0QsR0FGRCxNQUVLO0FBQ0gsU0FBSSxJQUFJOUIsQ0FBUixJQUFhK0IsUUFBYixFQUFzQjtBQUNwQixVQUFHL0IsS0FBRyxJQUFILElBQVVVLEtBQUtWLENBQUwsS0FBU2tDLFNBQXRCLEVBQWlDO0FBQy9CSCxpQkFBUy9CLENBQVQsSUFBWVUsS0FBS1YsQ0FBTCxDQUFaO0FBQ0Q7QUFDRjtBQUNGO0FBQ0R3QixzQkFBb0JkLElBQXBCO0FBQ0QsQ0FsQk07O0FBcUJBLElBQU15Qiw0QkFBUSxTQUFSQSxPQUFRLENBQUNkLElBQUQsRUFBTVEsUUFBTixFQUFpQjtBQUNwQyxNQUFHLENBQUNSLEtBQUt6RCxJQUFULEVBQWM7QUFBQztBQUFRO0FBQ3ZCeUQsT0FBSyxJQUFMLElBQVdFLGVBQVg7QUFDQVYsWUFBVVMsUUFBVixDQUFtQmMsT0FBbkIsQ0FBMkJmLElBQTNCO0FBQ0FHLHNCQUFvQkgsSUFBcEI7QUFDRCxDQUxNOztBQU9BLElBQU1nQiw4Q0FBaUIsU0FBakJBLGdCQUFpQixDQUFDMUQsT0FBRCxFQUFXO0FBQ3ZDbUMsc0JBQW9CbEMsSUFBcEIsQ0FBeUJELE9BQXpCO0FBQ0QsQ0FGTTs7QUFhQSxJQUFNMkQsb0NBQVksU0FBWkEsV0FBWSxHQUFJO0FBQzNCLFNBQU9DLE1BQU1DLFFBQVFDLElBQWQsRUFBb0I7QUFDckJDLFlBQVEsTUFEYTtBQUVyQjtBQUNBQyxpQkFBWSxTQUhTO0FBSXJCQyxVQUFLMUIsS0FBS08sU0FBTCxDQUFlZSxRQUFReEQsSUFBdkIsQ0FKZ0I7QUFLckI2RCxhQUFRO0FBQ0osc0JBQWVDLFNBRFg7QUFFSixzQkFBZ0I7QUFGWjtBQUxhLEdBQXBCLEVBU0ZDLElBVEUsQ0FTRyxVQUFTQyxHQUFULEVBQWM7QUFDbEIsV0FBT0EsSUFBSUMsSUFBSixFQUFQO0FBQ0gsR0FYSSxFQVdGRixJQVhFLENBV0csVUFBVUMsR0FBVixFQUFjLENBQ3JCLENBWkksRUFZRkUsS0FaRSxDQVlJLFVBQVNDLEdBQVQsRUFBYztBQUNuQixRQUFHQSxHQUFILEVBQU87QUFDSCxZQUFNQSxHQUFOO0FBQ0g7QUFDSixHQWhCSSxDQUFQO0FBaUJELENBbEJNLEMiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTYwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NWFlYzg1NjY0NjQ1YjQzZWZmNSIsImltcG9ydCB7Z2V0RGF0YX0gZnJvbSBcIi4vdG9vbHMvc3RvcmFnZVwiXG5jb25zdCBPTkVfTUlOVVRFPTMwKjEwMDA7XG5jaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZUJhY2tncm91bmRDb2xvcih7IGNvbG9yOiBbMjU1LCAwLCAwLCAyNTVdfSk7XG5jaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6XCJcIn0pO1xuY2hyb21lLmV4dGVuc2lvbi5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24ocG9ydCkge1xuICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0ZWQgLi4uLi5cIik7XG4gICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgdHJpZ2dlck1zZyhtc2cpIFxuIC8vICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UoXCJIaSBQb3B1cC5qc1wiKTtcbiAgICAgIH0pO1xufSlcblxuY2xhc3MgV2F0Y2hEb2d7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy53YXRjaExpc3Q9W107XG4gICAgdGhpcy5iYXJrSGFuZGxlcnM9W107XG4gICAgdGhpcy50aW1lb3V0SW50ZXJ2YWw9bnVsbDtcbiAgICB0aGlzLnJlTG9hZExpc3QoKTtcbiAgfVxuICBvbkRlc3Ryb3koKXtcblxuICB9XG4gIG9uQmFyayhoYW5kbGVyKXtcbiAgICB0aGlzLmJhcmtIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICB9XG4gIHJlTG9hZExpc3QoKXtcbiAgICBjb25zdCBub3dUaW1lU3RhbXA9bmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgY29uc3QgZGF0YT1nZXREYXRhKCk7XG4gICAgYWxlcnROb3RlSWRzPXt9O1xuICAgIHRoaXMud2F0Y2hMaXN0PWRhdGEuZmlsdGVyKChpdGVtKT0+e1xuICAgICAgaWYoaXRlbS5yZW1pbmRUaW1lPm5vd1RpbWVTdGFtcCl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfWVsc2UgaWYoaXRlbS5yZW1pbmRUaW1lPG5vd1RpbWVTdGFtcCl7XG4gICAgICAgIGFsZXJ0Tm90ZUlkc1tpdGVtLmlkXT1pdGVtO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBsZW5ndGg9T2JqZWN0LmtleXMoYWxlcnROb3RlSWRzKS5sZW5ndGg7XG4gICAgY29uc3QgdGV4dD1sZW5ndGg/bGVuZ3RoK1wiXCI6XCJcIjtcbiAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6dGV4dH0pO1xuXG4gICAgdGhpcy53YXRjaExpc3Quc29ydCgoYSxiKT0+e1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGEucmVtaW5kVGltZSk+cGFyc2VJbnQoYi5yZW1pbmRUaW1lKTtcbiAgICB9KTtcbiAgICB0aGlzLl9jaGVja01pblRpbWUoKTtcbiAgfVxuICBfY2hlY2tNaW5UaW1lKCl7XG4gICAgaWYodGhpcy53YXRjaExpc3QubGVuZ3RoPDEpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub3dUaW1lU3RhbXA9bmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgY29uc3QgbWluUmVtaW5kVGltZT10aGlzLndhdGNoTGlzdFswXS5yZW1pbmRUaW1lO1xuICAgIGNvbnN0IHN1cnBsdXNUaW1lPW1pblJlbWluZFRpbWUtbm93VGltZVN0YW1wO1xuICAgIGNvbnNvbGUubG9nKHN1cnBsdXNUaW1lLzIwMDAsdGhpcy53YXRjaExpc3QpO1xuICAgIGlmKHN1cnBsdXNUaW1lPDIwMDApey8v5bCP5LqOM+enku+8jOinpuWPkVxuICAgICAgZm9yKGxldCBpID0wOyBpPHRoaXMud2F0Y2hMaXN0Lmxlbmd0aDtpKyspe1xuICAgICAgICBsZXQgdGVtcD10aGlzLndhdGNoTGlzdFtpXTtcbiAgICAgICAgaWYodGVtcC5yZW1pbmRUaW1lLTIwMDA8bm93VGltZVN0YW1wKXtcbiAgICAgICAgICB0aGlzLmJhcmtIYW5kbGVycy5mb3JFYWNoKChpdGVtKT0+e1xuICAgICAgICAgICAgaXRlbSh0ZW1wKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLndhdGNoTGlzdC5zcGxpY2UoaSwxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fY2hlY2tNaW5UaW1lKCk7XG4gICAgfWVsc2Uge1xuICAgIHRoaXMudGltZW91dEludGVydmFsP2NsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJbnRlcnZhbCk6XCJcIjtcbiAgICB0aGlzLnRpbWVvdXRJbnRlcnZhbD1zZXRUaW1lb3V0KCgpPT57XG4gICAgICAgIHRoaXMuX2NoZWNrTWluVGltZSgpO1xuICAgICAgfSxzdXJwbHVzVGltZS8yKTtcbiAgICB9XG4gIH1cbn1cblxubGV0IFRpbWVyV2F0Y2hEb2c7XG5sZXQgYWxlcnROb3RlSWRzPXt9O1xuXG5mdW5jdGlvbiBuZXdXYXRjaERvZygpe1xuICBUaW1lcldhdGNoRG9nPW5ldyBXYXRjaERvZygpO1xuICBUaW1lcldhdGNoRG9nLm9uRGVzdHJveSgoKT0+e1xuXG4gIH0pO1xuICBUaW1lcldhdGNoRG9nLm9uQmFyaygobm90ZSk9PntcbiAgICBhbGVydE5vdGVJZHNbbm90ZS5pZF09bm90ZTtcbiAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6IChPYmplY3Qua2V5cyhhbGVydE5vdGVJZHMpLmxlbmd0aCkrXCIgXCJ9KTtcbiAgfSk7XG59XG5uZXdXYXRjaERvZygpO1xuXG5jb25zdCBNU0dNYW5hZ2UgPSB7XG4gIFwiQUREX1JFTUlORF9USU1FXCIobXNnKXtcbiAgICBpZighVGltZXJXYXRjaERvZyl7XG4gICAgICBuZXdXYXRjaERvZygpO1xuICAgIH1lbHNle1xuICAgICAgVGltZXJXYXRjaERvZy5yZUxvYWRMaXN0KCk7XG4gICAgfVxuICB9LFxuICBcIkNMRUFSX1JFTUlORFwiKG1zZyl7XG4gICAgVGltZXJXYXRjaERvZy5yZUxvYWRMaXN0KCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiB0cmlnZ2VyTXNnKG1zZyl7XG4gIE1TR01hbmFnZVttc2cuVFlQRV0/TVNHTWFuYWdlW21zZy5UWVBFXShtc2cpOlwiXCI7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYmFja2dyb3VuZC5qcyIsImxldCBMb2NhbERhdGE7XG5sZXQgbm90ZUxpc3RIYW5kbGVyTGlzdD1bXTtcbmxldCBsb2NhbFN0b3JhZ2U9d2luZG93LmxvY2FsU3RvcmFnZTtcblxuaWYoIWxvY2FsU3RvcmFnZS5EYXRhKXtcbiAgbG9jYWxTdG9yYWdlLkRhdGE9J3tcIm5vdGVMaXN0XCI6W119Jztcbn1cblxuTG9jYWxEYXRhPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLkRhdGEpO1xuXG5mdW5jdGlvbiBfZmlyZU5vdGVMaXN0SGFuZGxlclVwZGF0ZShub2RlKXtcbiAgZm9yKGxldCBpIGluIG5vdGVMaXN0SGFuZGxlckxpc3Qpe1xuICAgIGxldCBoYW5kbGVyPW5vdGVMaXN0SGFuZGxlckxpc3RbaV07XG4gICAgaGFuZGxlcihub2RlLExvY2FsRGF0YS5ub3RlTGlzdCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBfY3JlYXRlTm90ZUlkKCl7XG4gIGNvbnN0IGxlbmd0aD1Mb2NhbERhdGEubm90ZUxpc3QubGVuZ3RoO1xuICBjb25zdCBpZD1uZXcgRGF0ZSgpLmdldFRpbWUoKStcIl9cIitsZW5ndGg7XG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gX3NhdmVMb2NhbFRvU3RvcmFnZShub2RlKXtcbiAgbG9jYWxTdG9yYWdlLkRhdGE9SlNPTi5zdHJpbmdpZnkoTG9jYWxEYXRhKTtcbiAgX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUobm9kZSk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGdldERhdGE9KCk9PntcbiAgY29uc3QgbG9jYWxEYXRhPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLkRhdGEpO1xuICByZXR1cm4gbG9jYWxEYXRhLm5vdGVMaXN0O1xufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlTm9kZT0obm90ZSxjYWxsYmFjayk9PntcbiAgbGV0IGZpbmROb2RlSW5kZXg7XG4gIGNvbnN0IGZpbmROb3RlPUxvY2FsRGF0YS5ub3RlTGlzdC5maW5kKGZ1bmN0aW9uKGl0ZW0saW5kZXgpe1xuICAgICAgaWYoaXRlbS5pZD09bm90ZS5pZCl7XG4gICAgICAgIGZpbmROb2RlSW5kZXg9aW5kZXg7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICBpZighbm90ZS50ZXh0KXtcbiAgICBMb2NhbERhdGEubm90ZUxpc3Quc3BsaWNlKGZpbmROb2RlSW5kZXgsMSk7XG4gIH1lbHNle1xuICAgIGZvcih2YXIgaSBpbiBmaW5kTm90ZSl7XG4gICAgICBpZihpIT1cImlkXCImJihub3RlW2ldIT11bmRlZmluZWQpKXtcbiAgICAgICAgZmluZE5vdGVbaV09bm90ZVtpXVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBfc2F2ZUxvY2FsVG9TdG9yYWdlKG5vdGUpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhZGROb2RlPShub2RlLGNhbGxiYWNrKT0+e1xuICBpZighbm9kZS50ZXh0KXtyZXR1cm47fVxuICBub2RlW1wiaWRcIl09X2NyZWF0ZU5vdGVJZCgpO1xuICBMb2NhbERhdGEubm90ZUxpc3QudW5zaGlmdChub2RlKTtcbiAgX3NhdmVMb2NhbFRvU3RvcmFnZShub2RlKTtcbn1cblxuZXhwb3J0IGNvbnN0IG9uTm90ZUxpc3RDaGFuZ2U9KGhhbmRsZXIpPT57XG4gIG5vdGVMaXN0SGFuZGxlckxpc3QucHVzaChoYW5kbGVyKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuZXhwb3J0IGNvbnN0IEZ1cGRhdGVOb2RlPSgpPT57XG4gIHJldHVybiBmZXRjaChyZXF1ZXN0LnBhdGgsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIC8vY3JlZGVudGlhbHM6ICdvbWl0JyxcbiAgICAgICAgY3JlZGVudGlhbHM6J2luY2x1ZGUnLFxuICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHJlcXVlc3QuZGF0YSksXG4gICAgICAgIGhlYWRlcnM6e1xuICAgICAgICAgICAgXCJYLUNTUkYtVE9LRU5cIjpjc3JmVG9rZW4sXG4gICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcyl7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdG9vbHMvc3RvcmFnZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=