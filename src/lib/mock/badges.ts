/**
 * Badge 카탈로그 — 12개
 *
 * heavy 유저는 7개 보유: badge_001, 002, 004, 007, 008, 009, 011.
 * iconPath는 /badges/*.svg placeholder. 실제 SVG 자산은 후속 단계.
 */

import type { Badge } from '@/types';

export const BADGES: Badge[] = [
  {
    id: 'badge_001',
    name: { ko: '첫 한 잔', en: 'First Sip' },
    description: {
      ko: '처음으로 와인을 기록한 사람을 위한 뱃지.',
      en: 'For those who recorded their very first wine.',
    },
    iconPath: '/badges/first-sip.svg',
    tier: 'bronze',
    earnedCondition: {
      ko: '첫 테이스팅 노트 작성',
      en: 'Write your first tasting note',
    },
  },
  {
    id: 'badge_002',
    name: { ko: '셀러의 시작', en: 'Cellar Founder' },
    description: {
      ko: '나만의 셀러를 채우기 시작했습니다.',
      en: 'You have begun to build your own cellar.',
    },
    iconPath: '/badges/cellar-founder.svg',
    tier: 'bronze',
    earnedCondition: {
      ko: '셀러에 와인 5병 등록',
      en: 'Add 5 bottles to your cellar',
    },
  },
  {
    id: 'badge_003',
    name: { ko: '컬렉터', en: 'Collector' },
    description: {
      ko: '진지한 수집의 길로 들어선 사람.',
      en: 'You have entered the path of serious collecting.',
    },
    iconPath: '/badges/collector.svg',
    tier: 'silver',
    earnedCondition: {
      ko: '셀러에 와인 50병 등록',
      en: 'Add 50 bottles to your cellar',
    },
  },
  {
    id: 'badge_004',
    name: { ko: '세계 일주', en: 'Globetrotter' },
    description: {
      ko: '5개국 이상의 와인을 마셨습니다.',
      en: 'You have tasted wines from at least five countries.',
    },
    iconPath: '/badges/globetrotter.svg',
    tier: 'silver',
    earnedCondition: {
      ko: '5개국 이상의 와인 시음',
      en: 'Taste wines from 5+ countries',
    },
  },
  {
    id: 'badge_005',
    name: { ko: '대륙 정복자', en: 'Continent Conqueror' },
    description: {
      ko: '세 대륙 이상의 와인을 마신 탐험가.',
      en: 'An explorer who has tasted wines from three continents.',
    },
    iconPath: '/badges/continent-conqueror.svg',
    tier: 'gold',
    earnedCondition: {
      ko: '3개 대륙 이상의 와인 시음',
      en: 'Taste wines from 3+ continents',
    },
  },
  {
    id: 'badge_006',
    name: { ko: '부르고뉴 학생', en: 'Burgundy Student' },
    description: {
      ko: '부르고뉴의 위계를 끈기 있게 탐험 중입니다.',
      en: 'Patiently studying the Burgundy hierarchy.',
    },
    iconPath: '/badges/burgundy-student.svg',
    tier: 'silver',
    earnedCondition: {
      ko: '부르고뉴 와인 5종 시음',
      en: 'Taste 5 Burgundy wines',
    },
  },
  {
    id: 'badge_007',
    name: { ko: '아로마 헌터', en: 'Aroma Hunter' },
    description: {
      ko: '12개 아로마 카테고리 모두를 적어도 한 번씩 찾아낸 코.',
      en: 'A nose that has identified at least one aroma from all 12 categories.',
    },
    iconPath: '/badges/aroma-hunter.svg',
    tier: 'gold',
    earnedCondition: {
      ko: '12개 아로마 카테고리 모두 사용',
      en: 'Use all 12 aroma categories at least once',
    },
  },
  {
    id: 'badge_008',
    name: { ko: '블라인드 도전자', en: 'Blind Challenger' },
    description: {
      ko: '블라인드 노트를 작성한 적이 있는 용감한 미각.',
      en: 'A brave palate that has written a blind note.',
    },
    iconPath: '/badges/blind-challenger.svg',
    tier: 'gold',
    earnedCondition: {
      ko: '블라인드 모드로 1회 이상 테이스팅',
      en: 'Complete at least 1 blind tasting',
    },
  },
  {
    id: 'badge_009',
    name: { ko: '오랜 인내', en: 'Patient Cellarer' },
    description: {
      ko: '드링킹 윈도우가 5년 이상 남은 와인을 셀러에 보유 중.',
      en: 'You hold a wine whose drinking window opens 5+ years out.',
    },
    iconPath: '/badges/patient-cellarer.svg',
    tier: 'silver',
    earnedCondition: {
      ko: '5년 이상 숙성을 기다리는 와인 보유',
      en: 'Hold a wine awaiting 5+ years of aging',
    },
  },
  {
    id: 'badge_010',
    name: { ko: '카우달리 사냥꾼', en: 'Caudalie Hunter' },
    description: {
      ko: '단일 와인에서 12 카우달리 이상의 여운을 기록했습니다.',
      en: 'You logged a finish of 12 caudalies or more in a single wine.',
    },
    iconPath: '/badges/caudalie-hunter.svg',
    tier: 'gold',
    earnedCondition: {
      ko: '12 카우달리 이상 노트 1회',
      en: 'Record at least one 12+ caudalie note',
    },
  },
  {
    id: 'badge_011',
    name: { ko: '셀러의 손길', en: "Cellarer's Touch" },
    description: {
      ko: '셀러에서 마실 시점이 다가온 와인을 한 번이라도 열어본 사람.',
      en: 'Someone who has uncorked a cellar wine right at its drinking window.',
    },
    iconPath: '/badges/cellarers-touch.svg',
    tier: 'gold',
    earnedCondition: {
      ko: '드링킹 윈도우 도래 시 셀러 와인 오픈',
      en: 'Open a cellar wine within its drinking window',
    },
  },
  {
    id: 'badge_012',
    name: { ko: '한 잔의 마스터', en: 'Master of One Glass' },
    description: {
      ko: '단일 와인에 대해 가장 깊은 노트를 작성한 사람.',
      en: 'For the person who has written the deepest note on a single wine.',
    },
    iconPath: '/badges/master-of-one-glass.svg',
    tier: 'platinum',
    earnedCondition: {
      ko: '한 와인에 대해 모든 expert 필드를 채운 노트 1회',
      en: 'Fill every expert field for a single wine at least once',
    },
  },
];

export const BADGES_BY_ID: Record<string, Badge> = BADGES.reduce<Record<string, Badge>>(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {},
);

export function getBadge(id: string): Badge | undefined {
  return BADGES_BY_ID[id];
}
