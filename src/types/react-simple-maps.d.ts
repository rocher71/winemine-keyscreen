/**
 * Minimal declaration shim for react-simple-maps v3.
 *
 * Upstream types are not shipped with the library and the DT package
 * (@types/react-simple-maps) was not installed because of React 19 peer-dep
 * friction. The components we use are: ComposableMap, Geographies, Geography,
 * Marker. Their props are loosely typed below — enough to type-check page code.
 */
declare module 'react-simple-maps' {
  import type { ComponentType, CSSProperties, ReactNode, SVGProps } from 'react';

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const ComposableMap: ComponentType<ComposableMapProps>;

  export interface GeographiesRenderProps {
    geographies: Array<{
      id: string | number;
      rsmKey: string;
      properties: Record<string, unknown>;
    }>;
  }
  export interface GeographiesProps {
    geography: string | object;
    children: (args: GeographiesRenderProps) => ReactNode;
  }
  export const Geographies: ComponentType<GeographiesProps>;

  export interface GeographyStyleSet {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  }
  export interface GeographyProps extends Omit<SVGProps<SVGPathElement>, 'style'> {
    geography: GeographiesRenderProps['geographies'][number];
    style?: GeographyStyleSet;
  }
  export const Geography: ComponentType<GeographyProps>;

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onClick?: () => void;
  }
  export const Marker: ComponentType<MarkerProps>;

  export interface MoveEndPayload {
    coordinates: [number, number];
    zoom: number;
  }
  export interface MovePayload {
    x: number;
    y: number;
    zoom: number;
    dragging?: EventTarget | null;
  }
  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    filterZoomEvent?: (event: Event) => boolean;
    onMoveStart?: (payload: MoveEndPayload, event: Event) => void;
    onMove?: (payload: MovePayload, event: Event) => void;
    onMoveEnd?: (payload: MoveEndPayload, event: Event) => void;
    children?: ReactNode;
    className?: string;
  }
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
}
