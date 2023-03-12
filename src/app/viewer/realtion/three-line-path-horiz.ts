import Point from "../types/point";
import arrow from "./arrow";
import Orientation from "../types/orientation";
import { PATH_START } from "./relation-config";
import circlePath from "./circle-path";

export default (
  start: Point,
  end: Point,
  oneTo?: boolean,
  toMany?: boolean
): string => {
  let dStartLine: string;
  let dPath: string;
  const p2X = start.x + (end.x - start.x) / 2;
  let dArrow: string;
  if (start.x > end.x) {
    dArrow = arrow(end, toMany, Orientation.Left);
    dPath = `M ${start.x} ${start.y}`;
    oneTo = false;
    if (oneTo) {
      dStartLine = `M ${start.x - PATH_START} ${start.y - PATH_START} v ${
        2 * PATH_START
      }`;
      dPath += `H ${p2X}`;
    } else {
      // zero to
      dStartLine = circlePath(start.x - PATH_START, start.y);
      dPath += `m ${-PATH_START * 2} 0 H ${p2X}`;
    }
  } else {
    dArrow = arrow(end, toMany, Orientation.Right);
    dPath = `M ${start.x} ${start.y} `;
    oneTo = false;
    if (oneTo) {
      dStartLine = `M ${start.x + PATH_START} ${start.y - PATH_START} v ${
        2 * PATH_START
      }`;
      dPath += `H ${p2X}`;
    } else {
      // zero to
      dStartLine = circlePath(start.x + PATH_START, start.y);
      dPath += `m ${PATH_START * 2} 0 H ${p2X}`;
    }
  }

  dPath += `V ${end.y - 10} H ${end.x - 10}`;

  let middle = {
    x: (end.x - start.x) / 2,
    y: (end.y - start.y) / 2
  };

  let radius = Math.min(Math.abs(middle.x) / 2, Math.abs(middle.y) / 2, 10);

  if (Math.abs(middle.y) < 5 || Math.abs(middle.x) < 5) {
    dPath = `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;
  } else {

    const x1 = start.x + (Math.sign(middle.x) * (Math.abs(middle.x) - radius));

    dPath = `M ${start.x + Math.sign(middle.x) * radius}, ${start.y} H ${x1}
      Q ${start.x + middle.x}, ${start.y} ${start.x + middle.x},${start.y + Math.sign(middle.y) * radius}
      V ${start.y + 2 * middle.y - Math.sign(middle.y) * radius}
      Q ${start.x + middle.x}, ${end.y} ${start.x + middle.x + Math.sign(middle.x) * radius},${end.y}
      H ${start.x + 2 * middle.x - Math.sign(middle.x) * radius}`;
  }

  return `${dPath}`;
};
