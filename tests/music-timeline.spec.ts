import { expect, test } from "@playwright/test";
import { demoMusic } from "../src/data/courses";
import { timelineAt } from "../src/lib/music-timeline";

test("时间轴区间外不遗留数拍，预备拍与四拍八拍可核对", () => {
  expect(timelineAt(demoMusic, -1).beat).toBeNull();
  expect(timelineAt(demoMusic, 0).beat?.count).toBe(5);
  expect(timelineAt(demoMusic, 1.5).beat?.count).toBe(8);
  expect(timelineAt(demoMusic, 2).beat?.count).toBe(1);
  expect(timelineAt(demoMusic, 4.5).beat?.count).toBe(6);
  expect(timelineAt(demoMusic, 4.5, 4).beat?.count).toBe(2);
  expect(timelineAt(demoMusic, 24).beat).toBeNull();
  expect(timelineAt(demoMusic, 30).phrase).toBeUndefined();
});
