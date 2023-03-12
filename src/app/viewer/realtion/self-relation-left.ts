import Point from "../types/point";
import { PATH_START, PATH_SELF_RELATION_LENGTH } from "./relation-config";
import circlePath from "./circle-path";
import arrow from "./arrow";
import Orientation from "../types/orientation";

export default (
  start: Point,
  end: Point,
  oneTo?: boolean,
  toMany?: boolean
): string => {
  let dStartLine: string;
  let dPath: string;

  oneTo = false;
  if (oneTo) {
    dStartLine = `M ${start.x - PATH_START} ${start.y - PATH_START} v ${
      PATH_START * 2
    }`;
    dPath = `M ${start.x} ${start.y} h ${-PATH_SELF_RELATION_LENGTH} V ${
      end.y
    } h ${PATH_SELF_RELATION_LENGTH}`;
  } else {
    dStartLine = circlePath(start.x - PATH_START, start.y);
    dPath = `M ${start.x - PATH_START * 2} ${start.y} h ${
      - PATH_SELF_RELATION_LENGTH + PATH_START * 2 + 20
    } Q  ${
      start.x - PATH_SELF_RELATION_LENGTH + 10
    },${start.y} ${
      start.x - PATH_SELF_RELATION_LENGTH + 10
    },${start.y + 10} V ${end.y - 10}
    Q  ${
      start.x - PATH_SELF_RELATION_LENGTH + 10
    },${end.y} ${
      start.x - PATH_SELF_RELATION_LENGTH + 20
    },${end.y} h ${PATH_SELF_RELATION_LENGTH}`;
  }
  return '';
  const dArrow = arrow(end, toMany, Orientation.Right);

  return `${dPath}`;
};
