'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WallFactory;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _wallFactory3d = require('./wall-factory-3d');

var _sharedStyle = require('../../shared-style');

var SharedStyle = _interopRequireWildcard(_sharedStyle);

var _geometry = require('../../utils/geometry');

var Geometry = _interopRequireWildcard(_geometry);

var _translator = require('../../translator/translator');

var _translator2 = _interopRequireDefault(_translator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translator = new _translator2.default();

function WallFactory(name, info, textures) {
  var style_rect = void 0;
  var height = void 0;
  var thickness = void 0;
  switch (name) {
    case 'fence':
      height = 200;
      thickness = 5;
      style_rect = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: SharedStyle.MATERIAL_COLORS[500].brown };
      break;
    case 'deck':
      height = 60;
      thickness = 10;
      style_rect = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: SharedStyle.MATERIAL_COLORS[500].light_brown };
      break;
    case 'propertyline':
      height = 1;
      thickness = 2;
      style_rect = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: SharedStyle.COLORS.black };
      break;
    default:
      height = 200;
      thickness = 20;
      style_rect = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: 'url(#diagonalFill)' };
      break;
  }
  var element = {
    name: name,
    prototype: 'lines',
    info: info,
    properties: {
      height: {
        label: translator.t('height'),
        type: 'length-measure',
        defaultValue: {
          length: height
        }
      },
      thickness: {
        label: translator.t('thickness'),
        type: 'length-measure',
        defaultValue: {
          length: thickness
        }
      }
    },

    render2D: function render2D(element, layer, scene) {
      var _layer$vertices$get = layer.vertices.get(element.vertices.get(0)),
          x1 = _layer$vertices$get.x,
          y1 = _layer$vertices$get.y;

      var _layer$vertices$get2 = layer.vertices.get(element.vertices.get(1)),
          x2 = _layer$vertices$get2.x,
          y2 = _layer$vertices$get2.y;

      var length = Geometry.pointsDistance(x1, y1, x2, y2);
      var thickness = element.getIn(['properties', 'thickness', 'length']);
      var half_thickness = thickness / 2;

      return element.selected ? _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement('rect', { x: '0', y: -half_thickness, width: length, height: thickness, style: style_rect })
      ) : _react2.default.createElement('rect', { x: '0', y: -half_thickness, width: length, height: thickness, style: style_rect });
    },

    render3D: function render3D(element, layer, scene) {
      return (0, _wallFactory3d.buildWall)(element, layer, scene, textures);
    },

    updateRender3D: function updateRender3D(element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) {
      return (0, _wallFactory3d.updatedWall)(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
    }

  };

  if (textures && textures !== {}) {

    var textureValues = { 'none': 'None' };

    for (var textureName in textures) {
      textureValues[textureName] = textures[textureName].name;
    }

    element.properties.textureA = {
      label: translator.t('texture') + ' A',
      type: 'enum',
      defaultValue: textureValues.bricks ? 'bricks' : 'none',
      values: textureValues
    };

    element.properties.textureB = {
      label: translator.t('texture') + ' B',
      type: 'enum',
      defaultValue: textureValues.bricks ? 'bricks' : 'none',
      values: textureValues
    };
  }

  return element;
}