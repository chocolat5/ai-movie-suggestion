import type { SVGProps } from "react";

export function ArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <path d="M440-647 244-451q-12 12-28 11.5T188-452q-11-12-11.5-28t11.5-28l264-264q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l264 264q11 11 11 27.5T772-452q-12 12-28.5 12T715-452L520-647v447q0 17-11.5 28.5T480-160q-17 0-28.5-11.5T440-200v-447Z" />
    </svg>
  );
}

export function Asterisk(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <path d="M480-120q-17 0-28.5-11.5T440-160v-224L282-225q-12 12-28.5 12T225-225q-12-12-12-28.5t12-28.5l159-158H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h224L225-678q-12-12-12-28.5t12-28.5q12-12 28.5-12t28.5 12l158 159v-224q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800v224l158-159q12-12 28.5-12t28.5 12q12 12 12 28.5T735-678L576-520h224q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H576l159 158q12 12 12 28.5T735-225q-12 12-28.5 12T678-225L520-384v224q0 17-11.5 28.5T480-120Z" />
    </svg>
  );
}
