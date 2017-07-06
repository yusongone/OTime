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
/******/ 	return __webpack_require__(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ({

/***/ 59:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWQ1OTVkMzNlOWU5NTZkZTc2MmQ/MGMzNSIsIndlYnBhY2s6Ly8vLi9zcmMvdG9vbHMvc3RvcmFnZS5qcz81ODFhIl0sIm5hbWVzIjpbIkxvY2FsRGF0YSIsIm5vdGVMaXN0SGFuZGxlckxpc3QiLCJsb2NhbFN0b3JhZ2UiLCJ3aW5kb3ciLCJEYXRhIiwiSlNPTiIsInBhcnNlIiwiX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUiLCJub2RlIiwiaSIsImhhbmRsZXIiLCJub3RlTGlzdCIsIl9jcmVhdGVOb3RlSWQiLCJsZW5ndGgiLCJpZCIsIkRhdGUiLCJnZXRUaW1lIiwiX3NhdmVMb2NhbFRvU3RvcmFnZSIsInN0cmluZ2lmeSIsImdldERhdGEiLCJsb2NhbERhdGEiLCJ1cGRhdGVOb2RlIiwibm90ZSIsImNhbGxiYWNrIiwiZmluZE5vZGVJbmRleCIsImZpbmROb3RlIiwiZmluZCIsIml0ZW0iLCJpbmRleCIsInRleHQiLCJzcGxpY2UiLCJ1bmRlZmluZWQiLCJhZGROb2RlIiwidW5zaGlmdCIsIm9uTm90ZUxpc3RDaGFuZ2UiLCJwdXNoIiwiRnVwZGF0ZU5vZGUiLCJmZXRjaCIsInJlcXVlc3QiLCJwYXRoIiwibWV0aG9kIiwiY3JlZGVudGlhbHMiLCJib2R5IiwiZGF0YSIsImhlYWRlcnMiLCJjc3JmVG9rZW4iLCJ0aGVuIiwicmVzIiwianNvbiIsImNhdGNoIiwiZXJyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7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QyxpQkFBWSxTQUhTO0FBSXJCQyxVQUFLckMsS0FBS2EsU0FBTCxDQUFlb0IsUUFBUUssSUFBdkIsQ0FKZ0I7QUFLckJDLGFBQVE7QUFDSixzQkFBZUMsU0FEWDtBQUVKLHNCQUFnQjtBQUZaO0FBTGEsR0FBcEIsRUFTRkMsSUFURSxDQVNHLFVBQVNDLEdBQVQsRUFBYztBQUNsQixXQUFPQSxJQUFJQyxJQUFKLEVBQVA7QUFDSCxHQVhJLEVBV0ZGLElBWEUsQ0FXRyxVQUFVQyxHQUFWLEVBQWMsQ0FDckIsQ0FaSSxFQVlGRSxLQVpFLENBWUksVUFBU0MsR0FBVCxFQUFjO0FBQ25CLFFBQUdBLEdBQUgsRUFBTztBQUNILFlBQU1BLEdBQU47QUFDSDtBQUNKLEdBaEJJLENBQVA7QUFpQkQsQ0FsQk0sQyIsImZpbGUiOiJzdG9yYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1OSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWQ1OTVkMzNlOWU5NTZkZTc2MmQiLCJsZXQgTG9jYWxEYXRhO1xubGV0IG5vdGVMaXN0SGFuZGxlckxpc3Q9W107XG5sZXQgbG9jYWxTdG9yYWdlPXdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbmlmKCFsb2NhbFN0b3JhZ2UuRGF0YSl7XG4gIGxvY2FsU3RvcmFnZS5EYXRhPSd7XCJub3RlTGlzdFwiOltdfSc7XG59XG5cbkxvY2FsRGF0YT1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5EYXRhKTtcblxuZnVuY3Rpb24gX2ZpcmVOb3RlTGlzdEhhbmRsZXJVcGRhdGUobm9kZSl7XG4gIGZvcihsZXQgaSBpbiBub3RlTGlzdEhhbmRsZXJMaXN0KXtcbiAgICBsZXQgaGFuZGxlcj1ub3RlTGlzdEhhbmRsZXJMaXN0W2ldO1xuICAgIGhhbmRsZXIobm9kZSxMb2NhbERhdGEubm90ZUxpc3QpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gX2NyZWF0ZU5vdGVJZCgpe1xuICBjb25zdCBsZW5ndGg9TG9jYWxEYXRhLm5vdGVMaXN0Lmxlbmd0aDtcbiAgY29uc3QgaWQ9bmV3IERhdGUoKS5nZXRUaW1lKCkrXCJfXCIrbGVuZ3RoO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIF9zYXZlTG9jYWxUb1N0b3JhZ2Uobm9kZSl7XG4gIGxvY2FsU3RvcmFnZS5EYXRhPUpTT04uc3RyaW5naWZ5KExvY2FsRGF0YSk7XG4gIF9maXJlTm90ZUxpc3RIYW5kbGVyVXBkYXRlKG5vZGUpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBnZXREYXRhPSgpPT57XG4gIGNvbnN0IGxvY2FsRGF0YT1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5EYXRhKTtcbiAgcmV0dXJuIGxvY2FsRGF0YS5ub3RlTGlzdDtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZU5vZGU9KG5vdGUsY2FsbGJhY2spPT57XG4gIGxldCBmaW5kTm9kZUluZGV4O1xuICBjb25zdCBmaW5kTm90ZT1Mb2NhbERhdGEubm90ZUxpc3QuZmluZChmdW5jdGlvbihpdGVtLGluZGV4KXtcbiAgICAgIGlmKGl0ZW0uaWQ9PW5vdGUuaWQpe1xuICAgICAgICBmaW5kTm9kZUluZGV4PWluZGV4O1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgaWYoIW5vdGUudGV4dCl7XG4gICAgTG9jYWxEYXRhLm5vdGVMaXN0LnNwbGljZShmaW5kTm9kZUluZGV4LDEpO1xuICB9ZWxzZXtcbiAgICBmb3IodmFyIGkgaW4gbm90ZSl7XG4gICAgICBpZihpIT1cImlkXCImJihub3RlW2ldIT11bmRlZmluZWQpKXtcbiAgICAgICAgZmluZE5vdGVbaV09bm90ZVtpXVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBfc2F2ZUxvY2FsVG9TdG9yYWdlKG5vdGUpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhZGROb2RlPShub2RlLGNhbGxiYWNrKT0+e1xuICBpZighbm9kZS50ZXh0KXtyZXR1cm47fVxuICBub2RlW1wiaWRcIl09X2NyZWF0ZU5vdGVJZCgpO1xuICBMb2NhbERhdGEubm90ZUxpc3QudW5zaGlmdChub2RlKTtcbiAgX3NhdmVMb2NhbFRvU3RvcmFnZShub2RlKTtcbn1cblxuZXhwb3J0IGNvbnN0IG9uTm90ZUxpc3RDaGFuZ2U9KGhhbmRsZXIpPT57XG4gIG5vdGVMaXN0SGFuZGxlckxpc3QucHVzaChoYW5kbGVyKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuZXhwb3J0IGNvbnN0IEZ1cGRhdGVOb2RlPSgpPT57XG4gIHJldHVybiBmZXRjaChyZXF1ZXN0LnBhdGgsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIC8vY3JlZGVudGlhbHM6ICdvbWl0JyxcbiAgICAgICAgY3JlZGVudGlhbHM6J2luY2x1ZGUnLFxuICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHJlcXVlc3QuZGF0YSksXG4gICAgICAgIGhlYWRlcnM6e1xuICAgICAgICAgICAgXCJYLUNTUkYtVE9LRU5cIjpjc3JmVG9rZW4sXG4gICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcyl7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdG9vbHMvc3RvcmFnZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=