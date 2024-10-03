import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface ILogoSize {
  height: number;
  width: number;
}

export default function Logo() {
  const [logoSize, setLogoSize] = useState<ILogoSize>({ height: 0, width: 0 });
  const refLogo = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!refLogo.current?.parentElement) return;
    setLogoSize({
      height: refLogo.current.parentElement.clientHeight,
      width: refLogo.current.parentElement.clientHeight,
    });
  }, [refLogo]);

  return (
    <div ref={refLogo}>
      <svg
        width={logoSize.width}
        height={logoSize.height}
        viewBox="0 0 330 330"
        // fill="white"
        fill="#007bff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M81 99V294C81 296.209 82.7909 298 85 298H111C113.209 298 115 296.209 115 294V167.367C115 165.58 117.166 164.69 118.422 165.961L154.89 202.843C157.52 205.503 161.105 207 164.845 207H166.655C170.395 207 173.98 205.503 176.61 202.843L213.078 165.961C214.334 164.69 216.5 165.58 216.5 167.367V294C216.5 296.209 218.291 298 220.5 298H245.5C247.709 298 249.5 296.209 249.5 294V99C249.5 96.7909 247.709 95 245.5 95H218.393C217.195 95 216.06 95.5373 215.3 96.464L171 150.5L168.643 152.969C167.068 154.62 164.432 154.62 162.857 152.969L160.5 150.5L116.2 96.464C115.44 95.5373 114.305 95 113.107 95H85C82.7909 95 81 96.7909 81 99Z"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M165 330C256.127 330 330 256.127 330 165C330 73.873 256.127 0 165 0C73.873 0 0 73.873 0 165C0 256.127 73.873 330 165 330ZM165 290C234.036 290 290 234.036 290 165C290 95.9644 234.036 40 165 40C95.9644 40 40 95.9644 40 165C40 234.036 95.9644 290 165 290Z"
        />
      </svg>
    </div>
  );
}
