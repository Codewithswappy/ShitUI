'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { usePreviewStage } from './preview-context';

// Streamline Plump Landscape View Icon for Preview
function PreviewLandscapeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
      id="Landscape-View--Streamline-Plump"
      className={className}
    >
      <g id="landscape-view--photos-photo-picture-photography-pictures-view-eye-image">
        <path
          id="Subtract"
          opacity="0.32"
          fill="currentColor"
          d="M40.462 25.259a16.589 16.589 0 0 0 -7.465 -1.759c-6.943 0 -13.014 4.248 -15.148 10.4a6.407 6.407 0 0 0 0 4.2c0.29 0.834 0.651 1.633 1.078 2.391 -4.842 -0.041 -8.438 -0.223 -10.924 -0.41 -3.297 -0.247 -5.837 -2.787 -6.084 -6.084C1.706 31.168 1.5 26.903 1.5 21s0.206 -10.168 0.419 -12.997c0.247 -3.297 2.787 -5.837 6.084 -6.084C10.832 1.706 15.097 1.5 21 1.5s10.168 0.206 12.997 0.419c3.297 0.247 5.837 2.787 6.084 6.084 0.213 2.829 0.419 7.094 0.419 12.997 0 1.528 -0.014 2.947 -0.038 4.259Z"
        />
        <path
          id="Union"
          fill="currentColor"
          d="M30 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0 -7Z"
        />
        <path
          id="Subtract_2"
          fill="currentColor"
          d="M18.927 40.491c-4.842 -0.041 -8.438 -0.223 -10.924 -0.41 -3.296 -0.247 -5.837 -2.787 -6.084 -6.084 -0.153 -2.04 -0.303 -4.83 -0.375 -8.443 4.587 -4.46 7.723 -6.872 9.654 -8.153 1.636 -1.086 3.634 -0.892 5.123 0.332 1.433 1.178 3.654 3.128 6.917 6.286 2.193 -1.893 3.86 -3.127 5.062 -3.925 1.637 -1.086 3.634 -0.891 5.123 0.333 0.998 0.82 2.377 2.013 4.223 3.728a16.727 16.727 0 0 0 -4.648 -0.655c-6.944 0 -13.015 4.248 -15.15 10.4a6.407 6.407 0 0 0 0 4.2c0.29 0.834 0.652 1.633 1.079 2.391Z"
        />
        <path
          id="Union_2"
          fill="currentColor"
          d="M32.998 26.5c-5.734 0 -10.621 3.501 -12.315 8.384 -0.25 0.722 -0.25 1.51 0 2.232 1.694 4.883 6.58 8.384 12.315 8.384 5.733 0 10.62 -3.501 12.314 -8.384 0.25 -0.722 0.25 -1.51 0 -2.232 -1.694 -4.883 -6.58 -8.384 -12.314 -8.384Z"
        />
        <path
          id="Ellipse 18"
          opacity="0.32"
          fill="currentColor"
          d="M37 36a4 4 0 1 1 -8 0 4 4 0 0 1 8 0Z"
        />
      </g>
    </svg>
  );
}

// Streamline Solar Code Square Icon for Code
function CodeSquareIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Code-Square--Streamline-Solar"
      className={className}
    >
      <g id="Bold Duotone/Network IT Programming/Code Square">
        <path
          id="Vector"
          opacity="0.28"
          fill="currentColor"
          d="M2 12c0 -4.71405 0 -7.07107 1.46447 -8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447C22 4.92893 22 7.28595 22 12c0 4.714 0 7.0711 -1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0 -7.07107 0 -8.53553 -1.4645C2 19.0711 2 16.714 2 12Z"
        />
        <path
          id="Vector_2"
          fill="currentColor"
          d="M13.4881 6.44615c0.4001 0.1072 0.6375 0.51846 0.5303 0.91856l-2.5882 9.65919c-0.1072 0.4001 -0.5185 0.6376 -0.9186 0.5304 -0.4001 -0.1073 -0.6375 -0.5185 -0.53029 -0.9186l2.58819 -9.65922c0.1072 -0.4001 0.5185 -0.63754 0.9186 -0.53033Z"
        />
        <path
          id="Vector_3"
          fill="currentColor"
          d="M14.9697 8.46967c0.2929 -0.29289 0.7677 -0.29289 1.0606 0l0.2084 0.20834c0.6353 0.63529 1.1651 1.16507 1.5291 1.64219 0.3843 0.5036 0.6538 1.0357 0.6538 1.6798 0 0.6441 -0.2695 1.1762 -0.6538 1.6798 -0.364 0.4771 -0.8938 1.0069 -1.5291 1.6422l-0.2084 0.2083c-0.2929 0.2929 -0.7677 0.2929 -1.0606 0 -0.2929 -0.2929 -0.2929 -0.7677 0 -1.0606l0.1715 -0.1716c0.6817 -0.6817 1.1385 -1.1407 1.4341 -1.5282 0.2824 -0.3701 0.3463 -0.5856 0.3463 -0.7699 0 -0.1843 -0.0639 -0.3998 -0.3463 -0.7699 -0.2956 -0.3875 -0.7524 -0.8465 -1.4341 -1.52819l-0.1715 -0.17158c-0.2929 -0.29289 -0.2929 -0.76776 0 -1.06066Z"
        />
        <path
          id="Vector_4"
          fill="currentColor"
          d="M7.96986 8.46967c0.29289 -0.29289 0.76776 -0.29289 1.06066 0 0.29289 0.2929 0.29289 0.76777 0 1.06066l-0.17158 0.17158c-0.68165 0.68169 -1.13842 1.14069 -1.43406 1.52819 -0.28243 0.3701 -0.34627 0.5856 -0.34627 0.7699 0 0.1843 0.06384 0.3998 0.34627 0.7699 0.29564 0.3875 0.75241 0.8465 1.43406 1.5282l0.17158 0.1716c0.29289 0.2929 0.29289 0.7677 0 1.0606 -0.2929 0.2929 -0.76777 0.2929 -1.06066 0l-0.20835 -0.2083c-0.63534 -0.6353 -1.16513 -1.1651 -1.52916 -1.6422 -0.38424 -0.5036 -0.65374 -1.0357 -0.65374 -1.6798 0 -0.6441 0.2695 -1.1762 0.65374 -1.6798 0.36403 -0.47712 0.89382 -1.00689 1.52916 -1.64219l0.20835 -0.20834Z"
        />
      </g>
    </svg>
  );
}

// Streamline Solar Programming / CLI Square Icon
function CliSquareIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Programming-Square--Streamline-Solar"
      className={className}
    >
      <g id="Bold Duotone/Network IT Programming/Programming Square">
        <path
          id="Vector"
          opacity="0.28"
          fill="currentColor"
          d="M2 12c0 -4.71405 0 -7.07107 1.46447 -8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447C22 4.92893 22 7.28595 22 12c0 4.714 0 7.0711 -1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0 -7.07107 0 -8.53553 -1.4645C2 19.0711 2 16.714 2 12Z"
        />
        <path
          d="M7.5 8.5L11.5 12L7.5 15.5M13.5 15.5H16.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Streamline AI Spark Document icon for Prompt
function PromptSparkIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19.75 6.5c-0.4142 0 -0.75 -0.33579 -0.75 -0.75V5h-0.75c-0.4142 0 -0.75 -0.33579 -0.75 -0.75s0.3358 -0.75 0.75 -0.75H19v-0.75c0 -0.41421 0.3358 -0.75 0.75 -0.75s0.75 0.33579 0.75 0.75v0.75h0.75c0.4142 0 0.75 0.33579 0.75 0.75s-0.3358 0.75 -0.75 0.75h-0.75v0.75c0 0.41421 -0.3358 0.75 -0.75 0.75M7.33012 3.42242C7.48124 2.69509 8.11765 2 9.00136 2.00008c0.88339 0.00008 1.51964 0.69483 1.67074 1.42213 0.1389 0.66918 0.4879 1.67698 1.3584 2.54807 0.8701 0.87076 1.8776 1.21969 2.5468 1.35861 0.7275 0.15102 1.4227 0.78744 1.4227 1.6712 0 0.88362 -0.695 1.52001 -1.4223 1.67111 -0.6691 0.1391 -1.6766 0.4883 -2.5473 1.3594 -0.8703 0.8709 -1.2191 1.8777 -1.3579 2.5464 -0.1511 0.7275 -0.78754 1.423 -1.67155 1.423 -0.88338 0 -1.51983 -0.6946 -1.67105 -1.422 -0.13919 -0.6695 -0.48844 -1.6777 -1.35906 -2.5486 -0.87075 -0.8711 -1.87824 -1.2198 -2.54686 -1.3585 -0.72644 -0.1508 -1.42091 -0.78544 -1.42249 -1.66789 -0.00158 -0.88503 0.69442 -1.52296 1.42272 -1.67419 0.66918 -0.13895 1.67611 -0.48789 2.54665 -1.35865 0.87122 -0.87144 1.22028 -1.87888 1.35926 -2.54775M9.5 18.75v-1.7962c-0.15925 0.0301 -0.32576 0.0462 -0.49905 0.0462 -0.36523 0 -0.70035 -0.0714 -1.00095 -0.1958V18.75C8 20.5449 9.45507 22 11.25 22h7.5c1.7949 0 3.25 -1.4551 3.25 -3.25v-7.5C22 9.45507 20.5449 8 18.75 8h-1.9454c0.1241 0.30036 0.1954 0.63518 0.1954 1.00009 0 0.1736 -0.0161 0.3404 -0.0464 0.49991H18.75c0.9665 0 1.75 0.7835 1.75 1.75v7.5c0 0.9665 -0.7835 1.75 -1.75 1.75h-7.5c-0.9665 0 -1.75 -0.7835 -1.75 -1.75m2.5 -5c0 -0.4142 0.3358 -0.75 0.75 -0.75h5.5c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75h-5.5c-0.4142 0 -0.75 -0.3358 -0.75 -0.75m0.75 2.25c-0.4142 0 -0.75 0.3358 -0.75 0.75s0.3358 0.75 0.75 0.75h3.5c0.4142 0 0.75 -0.3358 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75zm-10 3c-0.41421 0 -0.75 0.3358 -0.75 0.75s0.33579 0.75 0.75 0.75h0.75v0.75c0 0.4142 0.33579 0.75 0.75 0.75s0.75 -0.3358 0.75 -0.75v-0.75h0.75c0.41421 0 0.75 -0.3358 0.75 -0.75S6.16421 19 5.75 19H5v-0.75c0 -0.4142 -0.33579 -0.75 -0.75 -0.75s-0.75 0.3358 -0.75 0.75V19z"
        fill="currentColor"
      />
    </svg>
  );
}

// Duo-stroke Expand Icon matching user reference
function ExpandPreviewIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        opacity="0.28"
        d="M13 22c4.055-.008 6.178-.107 7.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.071 2 16.714 2 12 2S4.929 2 3.464 3.464C2.107 4.822 2.008 6.944 2 11"
      />
      <path d="m12 12l5-5m0 0h-3.75M17 7v3.75" />
      <path d="M2 18c0-1.886 0-2.828.586-3.414S4.114 14 6 14s2.828 0 3.414.586S10 16.114 10 18s0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18Z" />
    </svg>
  );
}

// ChatGPT SVG Icon
function ChatGptIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={className}
    >
      <title>ChatGPT</title>
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.946-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

// Claude SVG Icon
function ClaudeIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <title>Claude</title>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

// v0 by Vercel SVG Icon
function V0Icon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M9.50321 5.5H13.2532C13.3123 5.5 13.3704 5.5041 13.4273 5.51203L9.51242 9.42692C9.50424 9.36912 9.5 9.31006 9.5 9.25L9.5 5.5L8 5.5L8 9.25C8 10.7688 9.23122 12 10.75 12H14.5V10.5L10.75 10.5C10.6899 10.5 10.6309 10.4958 10.5731 10.4876L14.4904 6.57028C14.4988 6.62897 14.5032 6.68897 14.5032 6.75V10.5H16.0032V6.75C16.0032 5.23122 14.772 4 13.2532 4H9.50321V5.5ZM0 5V5.00405L5.12525 11.5307C5.74119 12.3151 7.00106 11.8795 7.00106 10.8822V5H5.50106V9.58056L1.90404 5H0Z"
      />
    </svg>
  );
}

// Minimal modern external arrow icon
function ExternalArrowIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
    </svg>
  );
}

// Copy Icon for prompt dropdown
function CopyDefaultIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        opacity="0.32"
        d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.545 16.7553C19.0672 16.2607 20.2607 15.0673 20.7552 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7552 6.45492C20.2607 4.93273 19.0672 3.73931 17.545 3.24472C16.7919 3 15.8612 3 14 3C12.1387 3 11.208 3 10.4549 3.24472C8.93268 3.73931 7.73926 4.93273 7.24468 6.45492C7.18045 6.65258 7.13308 6.86246 7.09814 7.09819"
      />
      <path
        d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
      />
    </svg>
  );
}

export interface FloatingPreviewPillProps {
  isCodeOpen?: boolean;
  onToggleCode?: () => void;
  code?: string;
  componentName?: string;
  cliCommand?: string;
  className?: string;
  canRotate?: boolean;
  onRotate?: () => void;
  rotationDegree?: number;
  canExpand?: boolean;
  onExpand?: () => void;
}

type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn';

export function FloatingPreviewPill({
  isCodeOpen: propIsCodeOpen,
  onToggleCode: propOnToggleCode,
  code: propCode,
  componentName: propComponentName,
  cliCommand: propCliCommand,
  canRotate,
  onRotate,
  rotationDegree,
  canExpand,
  onExpand,
  className,
}: FloatingPreviewPillProps) {
  const pathname = usePathname();
  const isDocPage =
    pathname === '/docs' ||
    pathname.startsWith('/docs/installation') ||
    pathname.startsWith('/docs/introduction') ||
    pathname.startsWith('/docs/getting-started');

  if (isDocPage) return null;

  const context = usePreviewStage();
  const isCodeOpenRaw = propIsCodeOpen !== undefined ? propIsCodeOpen : context.isCodeOpen;
  const isCodeOpen = isCodeOpenRaw && !context.isInfoOpen;

  const onToggleCode = () => {
    if (context.isInfoOpen) {
      context.setIsInfoOpen(false);
      context.setIsCodeOpen(true);
    } else if (propOnToggleCode) {
      propOnToggleCode();
    } else {
      context.toggleCode();
    }
  };

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isCliOpen, setIsCliOpen] = useState(false);
  const [activePm, setActivePm] = useState<PackageManager>('pnpm');
  const [cliCopied, setCliCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const promptDropdownRef = useRef<HTMLDivElement>(null);
  const cliDropdownRef = useRef<HTMLDivElement>(null);
  const cliButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (promptDropdownRef.current && !promptDropdownRef.current.contains(target)) {
        setIsPromptOpen(false);
      }
      if (
        cliDropdownRef.current &&
        !cliDropdownRef.current.contains(target) &&
        cliButtonRef.current &&
        !cliButtonRef.current.contains(target)
      ) {
        setIsCliOpen(false);
      }
    };
    if (isPromptOpen || isCliOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPromptOpen, isCliOpen]);

  // Resolve component slug for CLI command
  const resolveSlug = (): string => {
    if (propComponentName) return propComponentName;
    if (context.componentName) return context.componentName;
    const rawCmd = propCliCommand || context.cliCommand;
    if (rawCmd) {
      const parsed = rawCmd
        .replace(/^https:\/\/shitui\.in\/r\//, '')
        .replace(/\.json$/, '')
        .replace(
          /^(npx|pnpm dlx|yarn dlx|bunx|bunx --bun)\s+(shadcn@latest|shadcn|rareui|shitui)\s+add\s+(@shitui\/)?/,
          ''
        )
        .replace(/^https?:\/\/[^\/]+\/r\//, '')
        .replace(/\.json$/, '')
        .trim();
      if (parsed) return parsed;
    }
    if (typeof window !== 'undefined' || pathname) {
      const parts = (pathname || window.location.pathname).split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== 'docs') return last;
    }
    return 'component';
  };

  const slug = resolveSlug()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  const pmCommands: Record<PackageManager, string> = {
    pnpm: `pnpm dlx shadcn@latest add https://shitui.in/r/${slug}.json`,
    npm: `npx shadcn@latest add https://shitui.in/r/${slug}.json`,
    bun: `bunx --bun shadcn@latest add https://shitui.in/r/${slug}.json`,
    yarn: `yarn dlx shadcn@latest add https://shitui.in/r/${slug}.json`,
  };

  const currentCliCommand = pmCommands[activePm];

  const handleCopyCliCommand = async (cmdToCopy?: string) => {
    const text = cmdToCopy || currentCliCommand;
    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCliCopied(true);
        setToastMessage('CLI command copied!');
        setIsCliOpen(false);
        setTimeout(() => setCliCopied(false), 2000);
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.error('Failed to copy CLI command:', err);
      }
    }
  };

  const getComponentUrl = () => {
    if (typeof window === 'undefined') return 'https://shitui.in';
    const href = window.location.href;
    if (href.includes('localhost') || href.includes('127.0.0.1')) {
      const p = window.location.pathname;
      return `https://shitui.in${p && p !== '/' ? p : ''}`;
    }
    return href;
  };

  const buildPrompt = () => {
    const componentUrl = getComponentUrl();
    return `I'm exploring this component from the RareUI documentation:
${componentUrl}

Help me understand how to implement, customize, and use this component in my React, Tailwind CSS, and Framer Motion project.
Be ready to explain key concepts, guide props configuration, provide realistic examples, and help debug or extend it based on this component.`;
  };

  const handleOpenPlatform = async (platformId: 'chatgpt' | 'claude' | 'v0' | 'copy') => {
    setIsPromptOpen(false);
    const promptText = buildPrompt();

    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(promptText);
      } catch (err) {
        console.error('Failed to copy prompt to clipboard:', err);
      }
    }

    const encodedPrompt = encodeURIComponent(promptText);

    if (platformId === 'chatgpt') {
      window.open(`https://chatgpt.com/?q=${encodedPrompt}`, '_blank', 'noopener,noreferrer');
      setToastMessage('Opening ChatGPT with prompt...');
    } else if (platformId === 'claude') {
      window.open(`https://claude.ai/new?q=${encodedPrompt}`, '_blank', 'noopener,noreferrer');
      setToastMessage('Opening Claude with prompt...');
    } else if (platformId === 'v0') {
      window.open(`https://v0.dev/chat?q=${encodedPrompt}`, '_blank', 'noopener,noreferrer');
      setToastMessage('Opening v0 with prompt...');
    } else if (platformId === 'copy') {
      setToastMessage('Prompt copied to clipboard!');
    }

    setTimeout(() => setToastMessage(null), 3000);
  };

  const platforms = [
    { id: 'chatgpt' as const, name: 'ChatGPT', icon: ChatGptIcon, color: 'text-[#10a37f]' },
    { id: 'claude' as const, name: 'Claude', icon: ClaudeIcon, color: 'text-[#D97757]' },
    { id: 'v0' as const, name: 'v0 by Vercel', icon: V0Icon, color: 'text-foreground' },
  ];

  const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: -6, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 420, damping: 26, mass: 0.8 },
    },
    exit: { opacity: 0, scale: 0.95, y: -4, filter: 'blur(2px)', transition: { duration: 0.12 } },
  };

  return (
    <div className={cn('relative z-40 select-none flex items-end w-full', className)}>
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: '-50%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: -8, x: '-50%', scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-14 left-1/2 z-50 flex items-center gap-2 whitespace-nowrap rounded-full bg-[#3f80ff] px-3.5 py-1.5 text-xs font-medium text-white shadow-pill-glow border border-[#3f80ff] backdrop-blur-md pointer-events-none select-none"
          >
            <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 1. COMPACT ELEVATED FOLDER TAB WITH PROPERLY CENTERED ICONS ─── */}
      <div className="relative inline-flex items-center h-[36px] pl-4 pr-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-tl-[24px] z-20 shrink-0 -mb-[1px]">
        <div className="flex items-center gap-1 translate-y-[2px]">
          {/* 1. Preview Icon Button */}
          <button
          type="button"
          onClick={() => {
            if (isCodeOpen) onToggleCode();
          }}
          title="Preview component"
          aria-label="Preview component"
          aria-pressed={!isCodeOpen}
          className={cn(
            'group relative flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer active:scale-95 shrink-0',
            !isCodeOpen
              ? 'bg-[#3f80ff] text-white shadow-pill-glow border border-[#3f80ff]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-300/50 dark:hover:bg-neutral-800/50'
          )}
        >
          <PreviewLandscapeIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
        </button>

        {/* 2. Code <> Icon Button */}
        <button
          type="button"
          onClick={() => {
            if (!isCodeOpen) onToggleCode();
          }}
          title={isCodeOpen ? 'Hide source code' : 'View source code'}
          aria-label={isCodeOpen ? 'Hide source code' : 'View source code'}
          aria-pressed={isCodeOpen}
          className={cn(
            'group relative flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer active:scale-95 shrink-0',
            isCodeOpen
              ? 'bg-[#3f80ff] text-white shadow-pill-glow border border-[#3f80ff]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-300/50 dark:hover:bg-neutral-800/50'
          )}
        >
          <CodeSquareIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
        </button>

        {/* 3. Compact CLI Icon Button (Click to Open Dropdown) */}
        <button
          ref={cliButtonRef}
          type="button"
          onClick={() => setIsCliOpen((prev) => !prev)}
          title="Open CLI install options"
          aria-label="Open CLI install options"
          aria-expanded={isCliOpen}
          className={cn(
            'group relative flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer active:scale-95 shrink-0',
            isCliOpen
              ? 'bg-[#3f80ff] text-white shadow-pill-glow border border-[#3f80ff]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-300/50 dark:hover:bg-neutral-800/50'
          )}
        >
          <CliSquareIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
        </button>

        {/* 4. Prompt AI Dropdown Icon Button */}
        <div ref={promptDropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsPromptOpen((prev) => !prev)}
            title="Open prompt in AI Studio"
            aria-label="Open prompt in AI Studio"
            aria-expanded={isPromptOpen}
            className={cn(
              'group relative flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer active:scale-95 shrink-0',
              isPromptOpen
                ? 'bg-[#3f80ff] text-white shadow-pill-glow border border-[#3f80ff]'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-300/50 dark:hover:bg-neutral-800/50'
            )}
          >
            <PromptSparkIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          </button>

          {/* AI Prompt Dropdown (properly styled for light & dark mode) */}
          <AnimatePresence>
            {isPromptOpen && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: 'top left' }}
                className="absolute top-full left-0 mt-2 w-[160px] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 p-1 shadow-xl dark:shadow-2xl backdrop-blur-xl z-50 text-neutral-900 dark:text-neutral-100"
              >
                <div className="space-y-0.5">
                  {platforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleOpenPlatform(p.id)}
                        className="group/item flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/item:scale-105', p.color)} />
                          <span className="text-[11px] font-medium tracking-tight">{p.name}</span>
                        </div>
                        <ExternalArrowIcon className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-500 transition-all duration-200 group-hover/item:text-neutral-700 dark:group-hover/item:text-neutral-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                      </button>
                    );
                  })}

                  <div className="my-0.5 border-t border-neutral-200 dark:border-neutral-800" />

                  <button
                    type="button"
                    onClick={() => handleOpenPlatform('copy')}
                    className="group/item flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2">
                      <CopyDefaultIcon className="h-3 w-3 shrink-0 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 group-hover/item:scale-105 group-hover/item:text-neutral-900 dark:group-hover/item:text-white" />
                      <span className="text-[11px] font-medium tracking-tight">Copy prompt</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Fullscreen Expand Icon Button (shown only if component needs it) */}
        {canExpand && (
          <button
            type="button"
            onClick={onExpand}
            title="Expand to full screen"
            aria-label="Expand to full screen"
            className="group relative flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer active:scale-95 shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-300/50 dark:hover:bg-neutral-800/50"
          >
            <ExpandPreviewIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          </button>
        )}
        </div>
      </div>

      {/* ─── 2. DEEP INVERTED FILLET CURVE (Drops all the way down to the top border) ─── */}
      <div className="relative -ml-[1px] -mb-[1px] w-[28px] h-[36px] pointer-events-none z-20 self-end overflow-visible shrink-0">
        <svg
          viewBox="0 0 28 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[28px] h-[36px] overflow-visible block"
        >
          {/* Fill underneath curve seamlessly matching outer container background */}
          <path
            d="M 0,0 A 14,14 0 0,1 14,14 L 14,22 A 14,14 0 0,0 28,36 L 28,38 L 0,38 Z"
            className="fill-neutral-200 dark:fill-neutral-800"
          />
          {/* Top curve stroke matching the outer container border */}
          <path
            d="M 0,0.5 A 14,14 0 0,1 14,14.5 L 14,22.5 A 14,14 0 0,0 28,36"
            fill="none"
            stroke="currentColor"
            strokeWidth="0"
            className="text-neutral-300 dark:text-neutral-800"
          />
        </svg>
      </div>

      {/* ─── 3. SPACER EXTENDING TO RIGHT EDGE (Uncovers container's own top border) ─── */}
      <div className="relative -ml-[1px] flex-1 self-end pointer-events-none" />

      {/* ─── 4. CLI DROPDOWN (Full width on Mobile centered, Wide on Desktop) ─── */}
      <AnimatePresence>
        {isCliOpen && (
          <motion.div
            ref={cliDropdownRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-[50px] inset-x-3 sm:inset-x-auto sm:left-4 sm:w-[560px] md:w-[620px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-3 shadow-sm shadow-black/5 z-50 text-neutral-900 dark:text-neutral-100 origin-top sm:origin-top-left"
          >
            {/* PM Tabs */}
            <div className="flex items-center justify-between pb-2 mb-2 ">
              <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800 p-0.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                {(['pnpm', 'npm', 'bun', 'yarn'] as PackageManager[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setActivePm(pm)}
                    className={cn(
                      'px-2.5 py-0.5 text-[11px] font-mono font-normal rounded-lg transition-all cursor-pointer ',
                      activePm === pm
                        ? 'bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white shadow-xs font-medium'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    )}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                CLI
              </span>
            </div>

            {/* Command Box */}
            <div
              onClick={() => handleCopyCliCommand()}
              title="Click to copy command"
              className="group/code flex items-center justify-between gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-2 cursor-pointer transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="flex items-center gap-1.5 overflow-hidden font-mono font-medium text-[11px] min-w-0 flex-1">
                <span className="text-neutral-400 select-none">$</span>
                <span className="truncate text-neutral-800 dark:text-neutral-200 select-all">
                  {currentCliCommand}
                </span>
              </div>

              <div className="shrink-0 pl-1 text-neutral-400 group-hover/code:text-neutral-800 dark:group-hover/code:text-neutral-200">
                {cliCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FloatingPreviewPill;
