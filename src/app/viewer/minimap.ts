import constant from "./const";
import Table from "./table";
import CommonEventListener from "./types/common-event-listener";
import ViewBoxVals from "./types/view-box-vals";
import Viewer from "./viewer";

export default class Minimap {
  onContainerMouseLeave?: () => void;
  onContainerMouseUp?: () => void;

  private minimap: Element;
  private viewpoint: Element;
  private btnZoomIn: Element;
  private btnZoomOut: Element;
  private tableMinimap!: Map<Table, SVGGraphicsElement>;

  constructor(
    private mainElem: ShadowRoot,
    private viewer: Viewer,
    private svgElem: SVGGraphicsElement
  ) {
    this.minimap = this.mainElem.getElementById("minimap")!;
    this.viewpoint = this.mainElem.getElementById("viewpoint")!;
    this.btnZoomIn = this.mainElem.getElementById("btn-zoom-in")!;
    this.btnZoomOut = this.mainElem.getElementById("btn-zoom-out")!;
    this.setUpEvents();
    this.reset();
  }

  #minimapPositionFromMouse = (event: MouseEvent): void => {
    const minimapBoundingClientRect = this.minimap.getBoundingClientRect();
    const x = event.clientX - minimapBoundingClientRect.left;
    const y = event.clientY - minimapBoundingClientRect.top;
    const svgElemBoundingClientRect = this.svgElem.getBoundingClientRect();
    const ratioX =
      svgElemBoundingClientRect.width / minimapBoundingClientRect.width;
    const ratioY =
      svgElemBoundingClientRect.height / minimapBoundingClientRect.height;
    const viewpointBoundingClientRect = this.viewpoint.getBoundingClientRect();
    const xCord = (x - viewpointBoundingClientRect.width / 2) * ratioX;
    const yCord = (y - viewpointBoundingClientRect.height / 2) * ratioY;

    void this.viewer.setPanX(xCord);
    void this.viewer.setPanY(yCord);
  };

  removeTables(): void {
    this.tableMinimap = new Map<Table, SVGGraphicsElement>();
    this.minimap
      .querySelectorAll(".mini_table")
      .forEach((miniTable) => miniTable.remove());
  }

  resetViewBox(): void {
    this.minimap.setAttribute(
      "viewBox",
      `0 0 ${this.viewer.getViewerPanWidth()} ${this.viewer.getViewerPanHeight()}`
    );
  }

  reset(): void {
    this.removeTables();
    this.resetViewBox();
  }

  setMinimapViewPoint(viewBoxVals: ViewBoxVals): void {
    this.viewpoint.setAttributeNS(null, "x", viewBoxVals.x.toString());
    this.viewpoint.setAttributeNS(null, "y", viewBoxVals.y.toString());
    this.viewpoint.setAttributeNS(null, "width", viewBoxVals.width.toString());
    this.viewpoint.setAttributeNS(
      null,
      "height",
      viewBoxVals.height.toString()
    );
  }

  createTable(table: Table): void {
    const tableMini = document.createElementNS(
      constant.nsSvg,
      "rect"
    ) as SVGGraphicsElement;
    tableMini.setAttributeNS(null, "class", "mini_table");
    this.tableMinimap.set(table, tableMini);
    this.minimap.appendChild(tableMini);
  }

  setTableDim(table: Table, x: number, y: number): void {
    const miniTable = this.tableMinimap.get(table)!;
    miniTable.setAttributeNS(null, "width", x.toString());
    miniTable.setAttributeNS(null, "height", y.toString());
  }

  onTableMove(table: Table, deltaX: number, deltaY: number): void {
    const minimapTableElem = this.tableMinimap.get(table)!;

    minimapTableElem.setAttributeNS(null, "x", deltaX.toString());
    minimapTableElem.setAttributeNS(null, "y", deltaY.toString());
  }

  #mouseDown = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.#minimapPositionFromMouse(event);
      this.minimap.addEventListener(
        "mousemove",
        this.#minimapPositionFromMouse as CommonEventListener
      );
    }
  };

  cleanUp(): void {
    this.btnZoomIn.removeEventListener("click", this.viewer.zoomIn);
    this.btnZoomOut.removeEventListener("click", this.viewer.zoomOut);
    this.minimap.removeEventListener(
      "mousedown",
      this.#mouseDown as CommonEventListener
    );

    this.minimap.removeEventListener(
      "mousemove",
      this.#minimapPositionFromMouse as CommonEventListener
    );
  }

  private setUpEvents(): void {
    this.btnZoomIn.addEventListener("click", this.viewer.zoomIn);
    this.btnZoomOut.addEventListener("click", this.viewer.zoomOut);

    this.minimap.addEventListener(
      "mousedown",
      this.#mouseDown as CommonEventListener
    );

    this.onContainerMouseLeave = (): void => {
      this.minimap.removeEventListener(
        "mousemove",
        this.#minimapPositionFromMouse as CommonEventListener
      );
    };

    this.onContainerMouseUp = this.onContainerMouseLeave;
  }
}
