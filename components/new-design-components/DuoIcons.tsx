'use client';

import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

// Sparkle / AI Icon (sparkle-ai-01.svg)
export function DuoSparkle({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M5 17.65V19M5 19V20.35M5 19H6.35M5 19H3.65M5.7 3C5.94808 4.50612 6.8515 5.44494 8.4 5.7C6.8515 5.95506 5.94808 6.89388 5.7 8.4C5.45192 6.89388 4.5485 5.95506 3 5.7C4.50612 5.45192 5.44494 4.5485 5.7 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9 3C13.5401 8.03653 15.5305 11.1418 21 12C15.8102 12.8143 13.5701 15.7277 12.9 21C12.2299 15.7277 9.98985 12.8143 4.8 12C9.98984 11.1857 12.2299 8.2723 12.9 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// GitHub Icon (github.svg)
export function DuoGithub({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M10 14.9993C9.34732 15.6987 8.98919 16.6227 9 17.5793V20.9993M14 14.9993C14.6527 15.6987 15.0108 16.6227 15 17.5793V20.9993M9 19.0493C8.10549 19.4055 7.13532 19.5294 6.18 19.4093C4.66 18.8893 5.06 17.5093 4.28 16.9393C3.90518 16.6713 3.46037 16.5184 3 16.4993"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.9999 9.74927C18.9999 12.7493 17.0499 14.9993 11.9999 14.9993C6.94994 14.9993 4.99994 12.7493 4.99994 9.74927C4.97524 8.70844 5.20887 7.67772 5.67994 6.74927C5.33994 5.27927 5.46994 3.46927 6.19994 3.10927C6.92994 2.74927 8.46994 3.40927 9.73994 4.25927C10.4859 4.12615 11.2422 4.05922 11.9999 4.05927C12.7571 4.05262 13.5134 4.11285 14.2599 4.23927C15.5299 3.38927 17.1399 2.75927 17.7999 3.08927C18.4599 3.41927 18.6599 5.25927 18.3199 6.72927C18.7943 7.66371 19.028 8.70171 18.9999 9.74927Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Search Default Icon (search-default.svg)
export function DuoSearch({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M21 21L14.9497 14.9497"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 10C17 11.933 16.2165 13.683 14.9497 14.9497C13.683 16.2165 11.933 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Slant Link / External Link Icon (link-slant.svg)
export function DuoLinkSlant({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M10.5858 6.3432L11.2929 5.6361C13.2455 3.68348 16.4113 3.68348 18.364 5.6361C20.3166 7.58872 20.3166 10.7545 18.364 12.7072L17.6569 13.4143M6.34314 10.5858L5.63604 11.293C3.68341 13.2456 3.68341 16.4114 5.63604 18.364C7.58866 20.3166 10.7545 20.3166 12.7071 18.364L13.4142 17.6569"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1213 9.87866L9.87866 14.1213"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Arrow Right Icon (arrow-right.svg)
export function DuoArrowRight({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M21 12L3 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.1696 6C17.273 7.55556 19.1622 9.37278 20.7905 11.4057C20.9302 11.5801 21 11.79 21 12C21 12.21 20.9302 12.4199 20.7905 12.5943C19.1622 14.6272 17.273 16.4444 15.1696 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Arrow Left Icon (arrow-left.svg)
export function DuoArrowLeft({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M4 12L20 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.8304 6C7.727 7.55556 5.83783 9.37278 4.20952 11.4057C4.06984 11.5801 4 11.79 4 12C4 12.21 4.06984 12.4199 4.20952 12.5943C5.83783 14.6272 7.727 16.4444 9.8304 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// X / Twitter Icon (x-com.svg)
export function DuoXCom({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.39524 2.0001C7.76115 1.99945 8.12933 1.99879 8.47985 2.102C8.786 2.19214 9.07205 2.34007 9.32256 2.53778C9.60939 2.76416 9.82167 3.06499 10.0326 3.36396C10.0494 3.38764 10.0661 3.41132 10.0828 3.43495L20.7973 18.5613C20.9941 18.839 21.1796 19.1008 21.31 19.326C21.4392 19.549 21.6145 19.8969 21.5977 20.3199C21.577 20.8381 21.3276 21.3205 20.9167 21.6368C20.5812 21.8951 20.196 21.9531 19.9393 21.9766C19.6802 22.0003 19.3594 22.0002 19.019 22.0002L17.2905 22.0002C17.2615 22.0002 17.2326 22.0003 17.2036 22.0003C16.8377 22.001 16.4695 22.0016 16.119 21.8984C15.8128 21.8083 15.5268 21.6603 15.2762 21.4626C14.9894 21.2362 14.7771 20.9354 14.5662 20.6364C14.5494 20.6128 14.5327 20.5891 14.516 20.5655L3.82469 5.47184C3.81694 5.46089 3.80919 5.44997 3.80147 5.43906C3.6047 5.16134 3.41924 4.89957 3.28881 4.67443C3.15959 4.45139 2.98427 4.10356 3.00113 3.68052C3.02178 3.16232 3.27122 2.67996 3.68215 2.36358C4.01761 2.1053 4.40279 2.0473 4.65949 2.02383C4.91859 2.00013 5.23941 2.00017 5.57977 2.0002C5.59314 2.00021 5.60653 2.00021 5.61995 2.00021H7.30831C7.33727 2.00021 7.36624 2.00016 7.39524 2.0001ZM7.91495 4.02057C7.87837 4.0098 7.8228 4.00021 7.30831 4.00021H5.61995C5.46901 4.00021 5.34264 4.00035 5.23537 4.00133C5.29657 4.08944 5.3695 4.19265 5.45674 4.31581L16.1481 19.4094C16.4454 19.8293 16.4854 19.8691 16.5153 19.8927C16.5654 19.9322 16.6226 19.9618 16.6839 19.9798C16.7204 19.9906 16.776 20.0002 17.2905 20.0002H18.9789C19.1298 20.0002 19.2562 20.0001 19.3634 19.9991C19.3022 19.911 19.2293 19.8078 19.1421 19.6846L8.45075 4.59098C8.15337 4.17115 8.11342 4.13134 8.08349 4.10772C8.03339 4.06818 7.97618 4.03859 7.91495 4.02057Z"
        fill="currentColor"
      />
      <path
        d="M14.8538 10.1706L20.5519 3.65852C20.9156 3.24288 20.8735 2.61112 20.4578 2.24744C20.0422 1.88375 19.4104 1.92587 19.0468 2.34151L13.6649 8.49216L14.8538 10.1706Z"
        fill="currentColor"
      />
      <path
        d="M9.40917 13.3559L10.5981 15.0343L4.80191 21.6585C4.43822 22.0742 3.80646 22.1163 3.39083 21.7526C2.97519 21.3889 2.93307 20.7571 3.29675 20.3415L9.40917 13.3559Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Discord Icon (discord.svg)
export function DuoDiscord({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M11 5.99991H13.6929C13.8829 5.99991 14.0565 5.89225 14.1409 5.72204L14.8191 4.35434C14.9221 4.14663 15.1533 4.03755 15.3761 4.10146C16.0315 4.2894 17.4069 4.74283 18.5042 5.49991C22.3682 8.39714 22.0078 14.8896 21.9786 16.2608C21.9768 16.3445 21.9554 16.427 21.9142 16.4999C19.9311 19.9999 16.491 19.9999 16.491 19.9999L15.3248 17.5737C12.8808 18.3088 11.1232 18.3086 8.67893 17.5733L7.50897 19.9999C7.50897 19.9999 4.06894 19.9999 2.08583 16.4999C2.04456 16.427 2.02319 16.3445 2.0214 16.2608C1.99218 14.8896 1.6318 8.39714 5.49577 5.49991C6.59358 4.74248 7.96978 4.28899 8.62476 4.10121C8.84722 4.03743 9.07799 4.14602 9.18127 4.35311L9.86449 5.72306C9.94909 5.8927 10.1224 5.99991 10.3119 5.99991H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.00128 17C7.60095 17.2248 8.15567 17.4159 8.67893 17.5734C11.1232 18.3087 12.8808 18.3089 15.3248 17.5738C15.8485 17.4163 16.4036 17.225 17.0039 17M10.002 12C10.002 12.5523 9.55421 13 9.00178 13C8.44936 13 8.00153 12.5523 8.00153 12C8.00153 11.4477 8.44936 11 9.00178 11C9.55421 11 10.002 11.4477 10.002 12ZM16.0036 12C16.0036 12.5523 15.5558 13 15.0033 13C14.4509 13 14.0031 12.5523 14.0031 12C14.0031 11.4477 14.4509 11 15.0033 11C15.5558 11 16.0036 11.4477 16.0036 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Close / Cancel Icon (multiple-cross-cancel-circle.svg)
export function DuoClose({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M2.84985 11.9999C2.84985 17.0533 6.94645 21.1499 11.9999 21.1499C17.0533 21.1499 21.1499 17.0533 21.1499 11.9999C21.1499 6.94645 17.0533 2.84985 11.9999 2.84985C6.94645 2.84985 2.84985 6.94645 2.84985 11.9999Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L12 12M12 12L15 9M12 12L9 9M12 12L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Layer Three Icon (layer-three.svg)
export function DuoLayers({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M2 17L12 22L22 17M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Layer Two Icon (layer-two.svg)
export function DuoLayerTwo({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M20.923 14.5737C20.8049 14.8092 20.4369 14.9833 19.7008 15.3313L13.4294 18.297C12.9053 18.5448 12.6433 18.6687 12.3684 18.7175C12.125 18.7607 11.8752 18.7607 11.6317 18.7175C11.3569 18.6687 11.0948 18.5448 10.5708 18.297L4.29934 15.3313C3.56328 14.9833 3.19525 14.8092 3.07715 14.5737"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.29927 10.8314C3.56321 10.4834 3.19518 10.3093 3.07708 10.0738C2.97431 9.86888 2.97431 9.63112 3.07708 9.42617C3.19518 9.19067 3.56321 9.01663 4.29927 8.66856L10.5707 5.70291C11.0948 5.45508 11.3568 5.33117 11.6317 5.2824C11.8751 5.2392 12.1249 5.2392 12.3683 5.2824C12.6432 5.33117 12.9052 5.45508 13.4293 5.70291L19.7007 8.66856C20.4368 9.01663 20.8048 9.19067 20.9229 9.42617C21.0257 9.63112 21.0257 9.86888 20.9229 10.0738C20.8048 10.3093 20.4368 10.4834 19.7007 10.8314L13.4293 13.7971C12.9052 14.0449 12.6432 14.1688 12.3683 14.2176C12.1249 14.2608 11.8751 14.2608 11.6317 14.2176C11.3568 14.1688 11.0948 14.0449 10.5707 13.7971L4.29927 10.8314Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Home Icon (home-simple.svg)
export function DuoHome({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.32"
        d="M3 12.7587C3 11.7418 3 11.2334 3.11866 10.7571C3.22385 10.3349 3.39721 9.93275 3.63191 9.56641C3.89667 9.15313 4.26632 8.80402 5.00561 8.1058L7.60561 5.65025C9.15211 4.18966 9.92537 3.45937 10.8075 3.18385C11.584 2.94132 12.416 2.94132 13.1925 3.18385C14.0746 3.45937 14.8479 4.18966 16.3944 5.65025L18.9944 8.1058C19.7337 8.80402 20.1033 9.15313 20.3681 9.56641C20.6028 9.93275 20.7761 10.3349 20.8813 10.7571C21 11.2334 21 11.7418 21 12.7587V14.6C21 16.8402 21 17.9603 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C17.9603 21 16.8402 21 14.6 21H9.4C7.15979 21 6.03968 21 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43597 18.816C3 17.9603 3 16.8402 3 14.6V12.7587Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.8813 10.7571C20.7761 10.3349 20.6028 9.93275 20.3681 9.56641C20.1033 9.15313 19.7337 8.80402 18.9944 8.1058L16.3944 5.65025C14.8479 4.18966 14.0746 3.45937 13.1925 3.18385C12.416 2.94132 11.584 2.94132 10.8075 3.18385C9.92535 3.45937 9.1521 4.18966 7.6056 5.65025L5.0056 8.1058C4.26631 8.80402 3.89666 9.15313 3.63189 9.56641C3.3972 9.93275 3.22384 10.3349 3.11865 10.7571"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Tag Icon (tag.svg)
export function DuoTag({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M18.194 8.29448L15.7725 5.87298C14.6593 4.75976 14.1026 4.20315 13.45 3.81725C12.8716 3.47524 12.2399 3.23281 11.5811 3.1001C10.8379 2.95035 10.0518 2.99172 8.47968 3.07447L7.65876 3.11768C6.13396 3.19793 5.37156 3.23805 4.78079 3.55489C4.26041 3.83397 3.83397 4.26041 3.55489 4.78079C3.23805 5.37156 3.19793 6.13396 3.11768 7.65876L3.07447 8.47968C2.99172 10.0518 2.95035 10.8379 3.1001 11.5811C3.23281 12.2399 3.47524 12.8716 3.81725 13.45C4.20315 14.1026 4.75976 14.6593 5.87297 15.7725L8.29448 18.194C9.6106 19.5101 10.2687 20.1682 10.9743 20.5277C12.4003 21.2543 14.0881 21.2543 15.5142 20.5277C16.2198 20.1682 16.8778 19.5101 18.1939 18.194L18.194 18.194L18.194 18.1939C19.5101 16.8778 20.1682 16.2198 20.5277 15.5142C21.2543 14.0881 21.2543 12.4003 20.5277 10.9743C20.1682 10.2687 19.5101 9.6106 18.194 8.29448Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5105 8.51245H8.5305M9.4895 8.48779C9.4895 9.04008 9.04179 9.48779 8.4895 9.48779C7.93722 9.48779 7.4895 9.04008 7.4895 8.48779C7.4895 7.93551 7.93722 7.48779 8.4895 7.48779C9.04179 7.48779 9.4895 7.93551 9.4895 8.48779Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// File / Docs Icon (file-02-default.svg)
export function DuoFile({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M16 22H8C5.79086 22 4 20.2091 4 18V6C4 3.79086 5.79086 2 8 2H12C16.4183 2 20 5.58172 20 10V18C20 20.2091 18.2091 22 16 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C16.4183 2 20 5.58172 20 10V11C20 9.34315 18.6569 8 17 8L16.4 8C16.0284 8 15.8426 8 15.6871 7.97538C14.8313 7.83983 14.1602 7.16865 14.0246 6.31287C14 6.1574 14 5.9716 14 5.6V5C14 3.34315 12.6569 2 11 2H12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Paint Brush / Backgrounds Icon (paint-brush.svg)
export function DuoPaintBrush({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M9.48413 11C10.1621 9.24803 11.4509 7.79138 13.1225 6.90642L20.3924 3.05761C20.8066 2.83833 21.255 3.28669 21.0357 3.70089L17.1869 10.9709C16.2863 12.6721 14.7935 13.9768 12.9999 14.6447"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.8504 15.1655C7.63373 13.9487 5.80114 14.027 4.77551 15.2723C4.12443 16.0628 4.36328 16.9401 3.99241 17.7948C3.65709 18.5677 2.84409 19.0655 2 19.0091C3.42052 21.4769 7.01349 21.6794 8.72141 19.4551C9.65433 18.2401 10.1231 16.4381 8.8504 15.1655Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// UFO / 3D Icon (ufo.svg)
export function DuoUfo({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M16.5609 7.43945C19.7904 8.10265 22 9.44818 22 11.0001C22 13.2093 17.5228 15.0001 12 15.0001C6.47715 15.0001 2 13.2093 2 11.0001C2 9.44818 4.20962 8.10265 7.43913 7.43945"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17L3 19M12 18V21M20 17L21 19M12 4C15.3489 4 17.2746 7.53239 16.9638 10.5391C15.5011 10.8323 13.8065 11 12 11C10.1935 11 8.49887 10.8323 7.03622 10.5391C6.72543 7.53239 8.6511 4 12 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Pencil Edit / Text Effects Icon (pencil-edit-swoosh.svg)
export function DuoPencilEdit({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M12 21C16.018 17.7256 16.0891 24.3574 21 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.06616 18.3151C3.07546 17.9381 3.08011 17.7497 3.12568 17.5726C3.16608 17.4156 3.23007 17.2658 3.31544 17.1282C3.41171 16.973 3.54444 16.8396 3.8099 16.573L16.8626 3.46297C17.3862 2.93708 18.204 2.84896 18.8267 3.25131C19.6037 3.75331 20.2713 4.42948 20.7594 5.21582C21.1632 5.86631 21.0315 6.68941 20.5014 7.22177L7.52811 20.2521C7.25274 20.5287 7.11505 20.6669 6.95435 20.7658C6.81188 20.8534 6.65654 20.9178 6.49406 20.9568C6.31079 21.0008 6.11608 21.0005 5.72665 20.9999L3 20.9955L3.06616 18.3151Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Layout Grid / Sections Icon (layout-grid-stack-down.svg)
export function DuoLayoutGrid({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <g opacity="0.28">
        <path
          d="M5.5 10C5.03535 10 4.80302 10 4.60982 9.96157C3.81644 9.80376 3.19624 9.18356 3.03843 8.39018C3 8.19698 3 7.96466 3 7.5L3 5.5C3 5.03534 3 4.80302 3.03843 4.60982C3.19624 3.81644 3.81644 3.19624 4.60982 3.03843C4.80302 3 5.03534 3 5.5 3C5.96466 3 6.19698 3 6.39018 3.03843C7.18356 3.19624 7.80376 3.81644 7.96157 4.60982C8 4.80302 8 5.03534 8 5.5V7.5C8 7.96466 8 8.19698 7.96157 8.39018C7.80376 9.18356 7.18356 9.80376 6.39018 9.96157C6.19698 10 5.96466 10 5.5 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.2 10C14.0799 10 13.5198 10 13.092 9.78201C12.7157 9.59027 12.4097 9.28431 12.218 8.90798C12 8.48016 12 7.92011 12 6.8V6.2C12 5.0799 12 4.51984 12.218 4.09202C12.4097 3.7157 12.7157 3.40973 13.092 3.21799C13.5198 3 14.0799 3 15.2 3L17.8 3C18.9201 3 19.4802 3 19.908 3.21799C20.2843 3.40973 20.5903 3.71569 20.782 4.09202C21 4.51984 21 5.07989 21 6.2V6.8C21 7.9201 21 8.48016 20.782 8.90798C20.5903 9.28431 20.2843 9.59027 19.908 9.78201C19.4802 10 18.9201 10 17.8 10H15.2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        d="M6.2 21C5.0799 21 4.51984 21 4.09202 20.782C3.7157 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8L3 17.2C3 16.0799 3 15.5198 3.21799 15.092C3.40973 14.7157 3.71569 14.4097 4.09202 14.218C4.51984 14 5.0799 14 6.2 14H17.8C18.9201 14 19.4802 14 19.908 14.218C20.2843 14.4097 20.5903 14.7157 20.782 15.092C21 15.5198 21 16.0799 21 17.2V17.8C21 18.9201 21 19.4802 20.782 19.908C20.5903 20.2843 20.2843 20.5903 19.908 20.782C19.4802 21 18.9201 21 17.8 21H6.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Copy Icon (copy-default.svg)
export function DuoCopy({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.545 16.7553C19.0672 16.2607 20.2607 15.0673 20.7552 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7552 6.45492C20.2607 4.93273 19.0672 3.73931 17.545 3.24472C16.7919 3 15.8612 3 14 3C12.1387 3 11.208 3 10.4549 3.24472C8.93268 3.73931 7.73926 4.93273 7.24468 6.45492C7.18045 6.65258 7.13308 6.86246 7.09814 7.09819"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Check Icon (check-tick-circle.svg)
export function DuoCheck({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M12.0001 21.1501C17.0535 21.1501 21.1501 17.0535 21.1501 12.0001C21.1501 6.94669 17.0535 2.8501 12.0001 2.8501C6.94669 2.8501 2.8501 6.94669 2.8501 12.0001C2.8501 17.0535 6.94669 21.1501 12.0001 21.1501Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.5124L10.8412 14.851C11.9672 12.8821 13.5256 11.1944 15.3987 9.91536L15.5 9.84619"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Clock / Changelog Icon (clock-default.svg)
export function DuoClock({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M12.0001 21.15C17.0535 21.15 21.1501 17.0534 21.1501 12C21.1501 6.94657 17.0535 2.84998 12.0001 2.84998C6.94669 2.84998 2.8501 6.94657 2.8501 12C2.8501 17.0534 6.94669 21.15 12.0001 21.15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V12.8164C12 12.9874 12.0873 13.1465 12.2316 13.2383L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export function RoundedMagniferIcon({ className, ...props }: IconProps) {
  return ( 
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <g id="Line Duotone/Search/Rounded Magnifer">
        <path
          stroke="currentColor"
          opacity="0.45"
          d="M11 20c4.9706 0 9 -4.0294 9 -9 0 -4.97056 -4.0294 -9 -9 -9 -4.97056 0 -9 4.02944 -9 9 0 4.9706 4.02944 9 9 9Z"
          strokeWidth="1.5"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          d="M21.8121 20.9749c-0.0627 0.0947 -0.176 0.208 -0.4026 0.4346 -0.2266 0.2266 -0.3399 0.3399 -0.4346 0.4026 -0.5546 0.3673 -1.3049 0.178 -1.6189 -0.4084 -0.0536 -0.1001 -0.0996 -0.2536 -0.1916 -0.5606 -0.1005 -0.3354 -0.1507 -0.5032 -0.1605 -0.6212 -0.0572 -0.695 0.523 -1.2752 1.218 -1.218 0.118 0.0098 0.2857 0.06 0.6212 0.1605 0.307 0.092 0.4605 0.138 0.5606 0.1916 0.5864 0.314 0.7757 1.0643 0.4084 1.6189Z"
          strokeWidth="1.5"
        />
      </g>
    </svg>
   );
}

// Chubby cute 5-pointed star with smoothly curved corners and glowing eyes
export function DuoCuteStar({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || 'w-3.5 h-3.5'}
      {...props}
    >
      <defs>
        <linearGradient
          id="duoCuteStarGrad"
          x1="12"
          y1="2"
          x2="12"
          y2="20.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFA6B8" />
          <stop offset="100%" stopColor="#FF7A97" />
        </linearGradient>
      </defs>
      {/* 5-pointed star with soft, generous curved corners and rounded joints */}
      <path
        d="M 10.4 5.2 Q 12.0 2.0 13.6 5.2 L 14.3 7.2 Q 14.8 8.4 15.9 8.5 L 19.2 8.8 Q 21.5 9.2 19.5 10.6 L 17.4 12.6 Q 16.3 13.6 16.7 14.8 L 17.3 18.2 Q 17.8 20.2 16.1 19.4 L 13.2 17.4 Q 12.0 16.6 10.8 17.4 L 7.9 19.4 Q 6.2 20.2 6.7 18.2 L 7.3 14.8 Q 7.7 13.6 6.6 12.6 L 4.5 10.6 Q 2.5 9.2 4.8 8.8 L 8.1 8.5 Q 9.2 8.4 9.7 7.2 Z"
        fill="url(#duoCuteStarGrad)"
        stroke="#FB7185"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Two round white eyes */}
      <circle cx="10" cy="11.2" r="1.35" fill="white" />
      <circle cx="14" cy="11.2" r="1.35" fill="white" />
    </svg>
  );
}

// Puzzle Piece Duotone Icon (Streamline Phosphor)
export function DuoPuzzlePiece({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <g id="puzzle-piece-duotone">
        <path
          opacity="0.32"
          fill="currentColor"
          d="M12.75 10.5c0.259375 0.00025 0.5155625 -0.0571875 0.75 -0.168125V13c0 0.132625 -0.0526875 0.2598125 -0.1464375 0.3535625S13.132625 13.5 13 13.5H4c-0.13260625 0 -0.25978125 -0.0526875 -0.35355 -0.1464375C3.55268125 13.2598125 3.5 13.132625 3.5 13v-2.668125c-0.26673125 0.1261875 -0.56104375 0.1829375 -0.85556875 0.164875 -0.294525 -0.0180625 -0.57970625 -0.1103125 -0.82901875 -0.2681875 -0.24930625 -0.157875 -0.45465625 -0.3761875 -0.59695 -0.6346875 -0.14229375 -0.2585 -0.21690625 -0.5488125 -0.21690625 -0.843875s0.0746125 -0.585375 0.21690625 -0.843875c0.14229375 -0.2585 0.34764375 -0.4768125 0.59695 -0.6346875 0.2493125 -0.1578125 0.53449375 -0.2500625 0.82901875 -0.268125 0.294525 -0.0180625 0.5888375 0.038625 0.85556875 0.1648125V4.50000625c0 -0.13260625 0.05268125 -0.2597875 0.14645 -0.35355 0.09376875 -0.09376875 0.22094375 -0.14645 0.35355 -0.14645h2.918125c-0.1263125 -0.2667375 -0.1831875 -0.5610875 -0.1651875 -0.8556875 0.018 -0.29459375 0.1101875 -0.57985625 0.268 -0.82925 0.1578125 -0.2494 0.3761875 -0.454825 0.6346875 -0.597175 0.2585625 -0.14235 0.5489375 -0.21699375 0.8440625 -0.21699375 0.295125 0 0.5855 0.07464375 0.8440625 0.21699375 0.2585 0.14235 0.476875 0.347775 0.6346875 0.597175 0.1578125 0.24939375 0.25 0.53465625 0.268 0.82925 0.018 0.2946 -0.038875 0.58895 -0.1651875 0.8556875H13c0.132625 0 0.2598125 0.05268125 0.3535625 0.14645 0.09375 0.0937625 0.1464375 0.22094375 0.1464375 0.35355V7.168125c-0.237125 -0.1121875 -0.4964375 -0.169625 -0.75875 -0.1680625 -0.262375 0.0015 -0.5209375 0.062 -0.75675 0.177 -0.2358125 0.115 -0.4426875 0.2815 -0.6054375 0.48725 -0.16275 0.20575 -0.2771875 0.4454375 -0.3348125 0.701375 -0.0575625 0.2559375 -0.0569375 0.5215625 0.002 0.7771875 0.058875 0.255625 0.1745 0.49475 0.33825 0.6996875s0.3715 0.370375 0.607875 0.4841875c0.236375 0.1138125 0.4953125 0.173 0.757625 0.17325Z"
        />
      </g>
    </svg>
  );
}

// Plus Square Duotone Icon (plus-square.svg)
export function DuoPlusSquare({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className || 'h-4 w-4'}
      {...props}
    >
      <path
        opacity="0.28"
        d="M6.70384 20.5432C7.80647 20.9999 9.20429 20.9999 11.9999 20.9999C14.7956 20.9999 16.1934 20.9999 17.296 20.5432C18.7662 19.9342 19.9343 18.7661 20.5432 17.296C20.9999 16.1934 20.9999 14.7955 20.9999 11.9999C20.9999 9.20423 20.9999 7.8064 20.5432 6.70378C19.9343 5.23361 18.7662 4.06556 17.296 3.4566C16.1934 2.99988 14.7956 2.99988 11.9999 2.99988C9.20429 2.99988 7.80647 2.99988 6.70384 3.4566C5.23367 4.06556 4.06563 5.23361 3.45666 6.70378C2.99994 7.8064 2.99994 9.20423 2.99994 11.9999C2.99994 14.7955 2.99994 16.1934 3.45666 17.296C4.06563 18.7661 5.23367 19.9342 6.70384 20.5432Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V16M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



