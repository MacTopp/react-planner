import React from 'react';
import { buildWall, updatedWall } from './wall-factory-3d';
import * as SharedStyle from '../../shared-style';
import * as Geometry from '../../utils/geometry';
import Translator from '../../translator/translator';

var translator = new Translator();

export default function WallFactory(name, info, textures) {
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

      return element.selected ? React.createElement(
        'g',
        null,
        React.createElement('rect', { x: '0', y: -half_thickness, width: length, height: thickness, style: style_rect })
      ) : React.createElement('rect', { x: '0', y: -half_thickness, width: length, height: thickness, style: style_rect });
    },

    render3D: function render3D(element, layer, scene) {
      return buildWall(element, layer, scene, textures);
    },

    updateRender3D: function updateRender3D(element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) {
      return updatedWall(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
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