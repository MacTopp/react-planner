import React from 'react';
import { buildWall, updatedWall } from './wall-factory-3d';
import * as SharedStyle from '../../shared-style';
import * as Geometry from '../../utils/geometry';
import Translator from '../../translator/translator';

const epsilon = 20;
const STYLE_TEXT = { textAnchor: 'middle' };
const STYLE_LINE = { stroke: SharedStyle.LINE_MESH_COLOR.selected };

let translator = new Translator();

export default function WallFactory(name, info, textures) {
    let style_rect;
    let height;
    let thickness;
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
  let element = {
    name,
    prototype: 'lines',
    info,
    properties: {
      height: {
        label: translator.t('height'),
        type: 'length-measure',
        defaultValue: {
          length: height,
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

    render2D: function (element, layer, scene) {
      let { x: x1, y: y1 } = layer.vertices.get(element.vertices.get(0));
      let { x: x2, y: y2 } = layer.vertices.get(element.vertices.get(1));

      let length = Geometry.pointsDistance(x1, y1, x2, y2);
      let length_5 = length / 5;

      let thickness = element.getIn(['properties', 'thickness', 'length']);
      let half_thickness = thickness / 2;
      let half_thickness_eps = half_thickness + epsilon;
      let char_height = 11;
      let extra_epsilon = 5;
      let textDistance = half_thickness + epsilon + extra_epsilon;

      return (element.selected) ?
        <g>
          <rect x="0" y={-half_thickness} width={length} height={thickness} style={style_rect} />
        </g> :
        <rect x="0" y={-half_thickness} width={length} height={thickness} style={style_rect} />
    },

    render3D: function (element, layer, scene) {
      return buildWall(element, layer, scene, textures);
    },

    updateRender3D: (element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) => {
      return updatedWall(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
    }

  };

  if (textures && textures !== {}) {

    let textureValues = { 'none': 'None' };

    for (let textureName in textures) {
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
