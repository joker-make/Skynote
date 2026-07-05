import React, { useEffect, useMemo, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudRain,
  CloudSun,
  Edit3,
  Frown,
  Heart,
  Loader2,
  MapPin,
  Moon,
  Navigation,
  PenLine,
  RefreshCw,
  Settings,
  Smile,
  Snowflake,
  Sparkles,
  Sun,
  Tag,
  Trash2,
  Wind,
} from 'lucide-react';

const moodOptions = [
  {
    id: 'bright',
    label: '晴朗',
    tone: '#f6b84b',
    icon: Smile,
    catImage: '/cats/cat-bright.svg',
    catAlt: '开心晒太阳的小猫',
  },
  {
    id: 'calm',
    label: '平静',
    tone: '#d9aa61',
    icon: CloudSun,
    catImage: '/cats/cat-calm.svg',
    catAlt: '抱着云朵窝在毯子里的小猫',
  },
  {
    id: 'low',
    label: '低落',
    tone: '#9aaec0',
    icon: Frown,
    catImage: '/cats/cat-low.svg',
    catAlt: '被小雨陪伴安静趴着的小猫',
  },
  {
    id: 'anxious',
    label: '焦虑',
    tone: '#e68168',
    icon: Heart,
    catImage: '/cats/cat-anxious.svg',
    catAlt: '抱着爪子旁边有星点的小猫',
  },
  {
    id: 'tired',
    label: '疲惫',
    tone: '#b69578',
    icon: Moon,
    catImage: '/cats/cat-tired.svg',
    catAlt: '睡在月亮垫上打哈欠的小猫',
  },
];

const weatherOptions = [
  { id: 'sunny', label: '晴', temp: 24, icon: Sun },
  { id: 'cloudy', label: '阴', temp: 21, icon: Cloud },
  { id: 'rainy', label: '雨', temp: 18, icon: CloudRain },
  { id: 'snowy', label: '雪', temp: -2, icon: Snowflake },
  { id: 'foggy', label: '雾', temp: 14, icon: CloudSun },
  { id: 'windy', label: '风', temp: 20, icon: Wind },
];

const skyLevelLabels = {
  sunny: ['清亮晴空', '暖阳晴空', '热烈晴空'],
  cloudy: ['凉阴薄云', '软云阴天', '厚云阴天'],
  rainy: ['小雨云', '中雨云', '大雨云'],
  snowy: ['小雪天', '中雪天', '大雪天'],
  foggy: ['轻雾天', '浓雾天', '厚雾天'],
  windy: ['微风天', '大风天', '强风天'],
};

const fallbackWeather = {
  latitude: 31.2304,
  longitude: 121.4737,
  location: '上海',
  locationDetail: '上海市 · 默认位置',
};

const weatherCodeMap = [
  { codes: [0, 1], weather: 'sunny' },
  { codes: [2, 3], weather: 'cloudy' },
  { codes: [45, 48], weather: 'foggy' },
  { codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99], weather: 'rainy' },
  { codes: [71, 73, 75, 77, 85, 86], weather: 'snowy' },
];

const tagOptions = ['散步', '工作', '睡眠', '朋友', '阅读', '独处'];

const moodScore = { low: 2, tired: 2.5, anxious: 3, calm: 4, bright: 5 };

const encouragementOptions = {
  bright: [
    '把这份轻快留住，明天也可以从一个小动作开始。',
    '今天的你有光，不需要解释，记下来就是一种庆祝。',
    '顺风的时候也值得被认真看见。',
  ],
  calm: [
    '平静不是没有波纹，是你已经能和今天好好相处。',
    '这种安稳很珍贵，像给心里留了一扇通风的窗。',
    '慢一点也很好，你正在把生活放回自己的节奏里。',
  ],
  low: [
    '低落可以先被放在这里，不必马上变好。',
    '今天难一点也没关系，你已经完成了记录这件小事。',
    '有些云会停一会儿，但它们不会永远停在同一个地方。',
  ],
  anxious: [
    '先把呼吸放慢一点，事情可以一件一件来。',
    '焦虑在提醒你在乎，也提醒你该给自己一点缓冲。',
    '写下来以后，心里的结就不必全部由你一个人拎着。',
  ],
  tired: [
    '累了就先收工，恢复也是认真生活的一部分。',
    '今天不用证明太多，能照顾好自己已经很重要。',
    '把疲惫写下来，然后允许身体慢慢回电。',
  ],
};

const seedEntries = [
  {
    id: 'seed-1',
    date: '2026-07-03',
    mood: 'calm',
    weather: 'cloudy',
    temperature: 22,
    location: '上海',
    content: '傍晚的云很低，路灯亮起来的时候突然觉得今天也被好好收住了。',
    tags: ['散步', '独处'],
    createdAt: '2026-07-03T19:20:00.000Z',
    updatedAt: '2026-07-03T19:20:00.000Z',
  },
  {
    id: 'seed-2',
    date: '2026-07-02',
    mood: 'bright',
    weather: 'sunny',
    temperature: 27,
    location: '上海',
    content: '午后阳光刚好，完成了一件拖了很久的小事。',
    tags: ['工作'],
    createdAt: '2026-07-02T15:45:00.000Z',
    updatedAt: '2026-07-02T15:45:00.000Z',
  },
  {
    id: 'seed-3',
    date: '2026-06-30',
    mood: 'tired',
    weather: 'rainy',
    temperature: 19,
    location: '上海',
    content: '雨声很密，适合慢一点。今天早点睡。',
    tags: ['睡眠'],
    createdAt: '2026-06-30T22:08:00.000Z',
    updatedAt: '2026-06-30T22:08:00.000Z',
  },
];

const today = new Date();
const todayKey = toDateKey(today);

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getOption(list, id) {
  return list.find((item) => item.id === id) ?? list[0];
}

function formatDateLabel(dateKey) {
  const date = new Date(`${dateKey}T12:00:00+08:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function formatMonthTitle(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

function loadEntries() {
  try {
    const raw = localStorage.getItem('skynote.entries');
    return normalizeEntries(raw ? JSON.parse(raw) : seedEntries);
  } catch {
    return normalizeEntries(seedEntries);
  }
}

function normalizeEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => entry && typeof entry === 'object').map(normalizeEntry);
}

function normalizeEntry(entry) {
  const mood = moodOptions.some((item) => item.id === entry.mood) ? entry.mood : 'calm';
  const weather = weatherOptions.some((item) => item.id === entry.weather) ? entry.weather : 'cloudy';
  const fallbackTemp = getOption(weatherOptions, weather).temp;
  const createdAt = Number.isNaN(Date.parse(entry.createdAt)) ? new Date().toISOString() : entry.createdAt;
  const temperature = Number.isFinite(Number(entry.temperature)) ? Math.round(Number(entry.temperature)) : fallbackTemp;
  const weatherMetrics = entry.weatherMetrics && typeof entry.weatherMetrics === 'object' ? entry.weatherMetrics : {};

  return {
    id: String(entry.id || `entry-${Date.now()}-${Math.random().toString(36).slice(2)}`),
    date: /^\d{4}-\d{2}-\d{2}$/.test(entry.date) ? entry.date : toDateKey(new Date(createdAt)),
    mood,
    weather,
    temperature,
    location: typeof entry.location === 'string' && entry.location.trim() ? entry.location.trim() : fallbackWeather.location,
    content: typeof entry.content === 'string' ? entry.content : '',
    tags: Array.isArray(entry.tags) ? entry.tags.filter((tag) => typeof tag === 'string') : [],
    encouragement:
      typeof entry.encouragement === 'string' && entry.encouragement.trim()
        ? entry.encouragement
        : getEncouragement(mood, 0),
    weatherSource: entry.weatherSource === 'auto' ? 'auto' : 'manual',
    weatherLevel: clampSkyLevel(entry.weatherLevel ?? getSkyLevelFromMetrics(weather, temperature, weatherMetrics)),
    weatherMetrics,
    createdAt,
    updatedAt: Number.isNaN(Date.parse(entry.updatedAt)) ? createdAt : entry.updatedAt,
  };
}

function getEncouragement(mood, index) {
  const messages = encouragementOptions[mood] ?? encouragementOptions.calm;
  return messages[index % messages.length];
}

function mapWeatherCode(code, windSpeed) {
  if (windSpeed >= 28) return 'windy';
  return weatherCodeMap.find((item) => item.codes.includes(code))?.weather ?? 'cloudy';
}

function clampSkyLevel(level) {
  if (!Number.isFinite(Number(level))) return 1;
  return Math.min(2, Math.max(0, Math.round(Number(level))));
}

function getTemperatureSkyLevel(temperature) {
  const value = Number(temperature);
  if (value <= 12) return 0;
  if (value >= 30) return 2;
  return 1;
}

function getSkyLevelFromMetrics(weather, temperature, metrics = {}) {
  if (weather === 'sunny' || weather === 'cloudy') {
    return getTemperatureSkyLevel(temperature);
  }

  if (weather === 'rainy') {
    const rain = Math.max(
      Number(metrics.precipitation ?? 0),
      Number(metrics.rain ?? 0),
      Number(metrics.showers ?? 0),
    );
    if (Number(metrics.weatherCode) >= 95 || rain >= 7) return 2;
    if (rain >= 1.5) return 1;
    return 0;
  }

  if (weather === 'snowy') {
    const snowfall = Number(metrics.snowfall ?? 0);
    if (snowfall >= 2) return 2;
    if (snowfall >= 0.5) return 1;
    return 0;
  }

  if (weather === 'foggy') {
    if (Number(metrics.weatherCode) === 48 || Number(metrics.humidity ?? 0) >= 92) return 2;
    if (Number(metrics.humidity ?? 0) >= 82) return 1;
    return 0;
  }

  if (weather === 'windy') {
    const windSpeed = Number(metrics.windSpeed ?? 0);
    if (windSpeed >= 38) return 2;
    if (windSpeed >= 24) return 1;
    return 0;
  }

  return 1;
}

function getSkyProfile(weather, temperature, level = 1) {
  const safeWeather = weatherOptions.some((item) => item.id === weather) ? weather : 'cloudy';
  const normalizedLevel =
    safeWeather === 'sunny' || safeWeather === 'cloudy'
      ? getTemperatureSkyLevel(temperature)
      : clampSkyLevel(level);
  const labels = skyLevelLabels[safeWeather] ?? skyLevelLabels.cloudy;

  return {
    weather: safeWeather,
    level: normalizedLevel,
    label: labels[normalizedLevel] ?? labels[1],
    className: `sky-${safeWeather} sky-level-${normalizedLevel}`,
  };
}

function formatWeatherMetrics(weather, metrics = {}) {
  const parts = [];
  if (weather === 'rainy' && Number.isFinite(Number(metrics.precipitation))) {
    parts.push(`降水 ${Number(metrics.precipitation).toFixed(1)}mm`);
  }
  if (weather === 'snowy' && Number.isFinite(Number(metrics.snowfall))) {
    parts.push(`降雪 ${Number(metrics.snowfall).toFixed(1)}cm`);
  }
  if (weather === 'windy' && Number.isFinite(Number(metrics.windSpeed))) {
    parts.push(`风速 ${Math.round(Number(metrics.windSpeed))}km/h`);
  }
  if (weather === 'foggy' && Number.isFinite(Number(metrics.humidity))) {
    parts.push(`湿度 ${Math.round(Number(metrics.humidity))}%`);
  }
  return parts.join(' · ');
}

function roundCoord(value) {
  return Number(value).toFixed(4);
}

function formatCoordinateLabel(latitude, longitude) {
  return `${roundCoord(latitude)}, ${roundCoord(longitude)}`;
}

function formatPlaceName(place) {
  const parts = [place.name, place.admin2, place.admin1, place.country]
    .filter(Boolean)
    .filter((part, index, list) => list.indexOf(part) === index);
  return parts.slice(0, 3).join(' · ') || place.name || '已选位置';
}

function compactParts(parts, limit = 3) {
  return parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .filter((part, index, list) => list.indexOf(part) === index)
    .slice(0, limit)
    .join(' · ');
}

function parseBigDataCloudAddress(data) {
  const administrative = data.localityInfo?.administrative || [];
  const adminNames = administrative
    .map((item) => item.name)
    .filter(Boolean)
    .reverse();
  const city = data.city || data.locality || adminNames.find((name) => /市|州|盟|地区|县/.test(name));
  const district = data.locality && data.locality !== city ? data.locality : adminNames.find((name) => /区|县|镇|街道/.test(name));
  const province = data.principalSubdivision || adminNames[0];
  const country = data.countryName;
  const location = compactParts([city, district || province], 2);
  const detail = compactParts([district, city, province, country], 4);

  return location
    ? {
        location,
        locationDetail: detail || location,
      }
    : null;
}

function parseNominatimAddress(data) {
  const address = data.address || {};
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.county ||
    address.state ||
    data.name;
  const district = address.city_district || address.district || address.county || address.suburb || address.quarter;
  const state = address.state;
  const country = address.country;
  const location = compactParts([city, district && district !== city ? district : null], 2);
  const detail = compactParts([district, city, state, country], 4);

  return location
    ? {
        location,
        locationDetail: detail || location,
      }
    : null;
}

function parsePhotonAddress(data) {
  const place = data.features?.[0]?.properties;
  if (!place) return null;

  const city = place.city || place.county || place.state || place.country;
  const district = place.district || place.locality || place.county;
  const state = place.state;
  const country = place.country;
  const location = compactParts([city, district && district !== city ? district : null], 2);
  const detail = compactParts([district, city, state, country], 4);

  return location
    ? {
        location,
        locationDetail: detail || location,
      }
    : null;
}

function readLastWeatherLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem('skynote.lastWeatherLocation') || 'null');
    if (saved && Number.isFinite(Number(saved.latitude)) && Number.isFinite(Number(saved.longitude))) {
      return {
        latitude: Number(saved.latitude),
        longitude: Number(saved.longitude),
        location: saved.location || '上次位置',
        locationDetail: saved.locationDetail || saved.location || '上次成功定位',
        source: 'cached',
        reason: '定位不可用',
      };
    }
  } catch {
    return null;
  }
  return null;
}

function saveLastWeatherLocation(location) {
  if (location.source !== 'device') return;
  localStorage.setItem(
    'skynote.lastWeatherLocation',
    JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
      location: location.location,
      locationDetail: location.locationDetail,
    }),
  );
}

async function resolveLocationLabel(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
    });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://photon.komoot.io/reverse?${params.toString()}`, {
      signal: controller.signal,
    });
    window.clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      const parsed = parsePhotonAddress(data);
      if (parsed) return parsed;
    }
  } catch {
    // Try the next reverse geocoding provider.
  }

  try {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(latitude),
      lon: String(longitude),
      'accept-language': 'zh-CN',
    });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      signal: controller.signal,
    });
    window.clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      const parsed = parseNominatimAddress(data);
      if (parsed) return parsed;
    }
  } catch {
    // Keep a natural fallback when all reverse geocoding providers fail.
  }

  return {
    location: '自动定位位置',
    locationDetail: '已获取定位，地址解析暂不可用',
  };
}

function getFallbackPosition(reason) {
  const cached = readLastWeatherLocation();
  if (cached) {
    return {
      ...cached,
      reason,
      locationDetail: `${cached.locationDetail} · 上次成功定位`,
    };
  }

  return {
    ...fallbackWeather,
    source: 'fallback',
    reason,
  };
}

async function getNativePosition() {
  try {
    const checked = await Geolocation.checkPermissions();
    let permissionState = checked.location;

    if (permissionState === 'prompt' || permissionState === 'prompt-with-rationale') {
      const requested = await Geolocation.requestPermissions();
      permissionState = requested.location;
    }

    if (permissionState !== 'granted') {
      return getFallbackPosition('未授权定位');
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      maximumAge: 5 * 60 * 1000,
      timeout: 12000,
    });
    const label = await resolveLocationLabel(position.coords.latitude, position.coords.longitude);

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      ...label,
      source: 'device',
    };
  } catch {
    return getFallbackPosition('定位失败');
  }
}

function getWebPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getFallbackPosition('浏览器不支持定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const label = await resolveLocationLabel(position.coords.latitude, position.coords.longitude);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ...label,
          source: 'device',
        });
      },
      (error) => {
        const reason =
          {
            1: '未授权定位',
            2: '定位不可用',
            3: '定位超时',
          }[error.code] ?? '未获取定位';
        resolve(getFallbackPosition(reason));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000,
        timeout: 10000,
      },
    );
  });
}

async function getCurrentPosition() {
  if (Capacitor.isNativePlatform()) {
    return getNativePosition();
  }
  return getWebPosition();
}

async function searchWeatherLocations(query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const params = new URLSearchParams({
    name: normalizedQuery,
    count: '6',
    language: 'zh',
    format: 'json',
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Location search failed: ${response.status}`);
  }
  const data = await response.json();
  return (data.results || []).map((place) => {
    const label = formatPlaceName(place);
    return {
      id: `${place.id || label}-${place.latitude}-${place.longitude}`,
      latitude: place.latitude,
      longitude: place.longitude,
      location: place.name || label,
      locationDetail: label,
      country: place.country,
    };
  });
}

function buildDailyMoodSummaries(entries, dayCount = 7) {
  const days = [];
  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = toDateKey(date);
    const dayEntries = entries
      .filter((entry) => entry.date === key)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const count = dayEntries.length;
    const averageScore = count
      ? dayEntries.reduce((sum, entry) => sum + (moodScore[entry.mood] ?? moodScore.calm), 0) / count
      : 0;
    const moodCounts = moodOptions.map((option) => ({
      ...option,
      count: dayEntries.filter((entry) => entry.mood === option.id).length,
    }));
    const dominantMood =
      moodCounts
        .filter((option) => option.count > 0)
        .sort((a, b) => b.count - a.count || moodScore[b.id] - moodScore[a.id])[0]?.id ?? 'calm';

    days.push({
      key,
      label: key.slice(5).replace('-', '/'),
      count,
      averageScore,
      dominantMood,
    });
  }
  return days;
}

function describeMoodScore(score, count) {
  if (!count) return '暂无记录';
  if (score >= 4.6) return '很明亮';
  if (score >= 3.8) return '比较平稳';
  if (score >= 3) return '有些起伏';
  if (score >= 2.4) return '偏疲惫';
  return '需要照顾';
}

function getRecordStreak(entries) {
  const uniqueDates = [...new Set(entries.map((entry) => entry.date))]
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) {
    return { days: 0, startDate: null, endDate: null };
  }

  let days = 1;
  let previousDate = new Date(`${uniqueDates[0]}T12:00:00+08:00`);

  for (let index = 1; index < uniqueDates.length; index += 1) {
    const currentDate = new Date(`${uniqueDates[index]}T12:00:00+08:00`);
    const diffDays = Math.round((previousDate - currentDate) / (24 * 60 * 60 * 1000));
    if (diffDays !== 1) break;
    days += 1;
    previousDate = currentDate;
  }

  return {
    days,
    startDate: uniqueDates[days - 1],
    endDate: uniqueDates[0],
  };
}

function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [entries, setEntries] = useState(loadEntries);
  const [coverSeen, setCoverSeen] = useState(() => localStorage.getItem('skynote.coverSeen') === 'true');
  const [mood, setMood] = useState('calm');
  const [weather, setWeather] = useState('sunny');
  const [temperature, setTemperature] = useState(24);
  const [weatherLevel, setWeatherLevel] = useState(1);
  const [weatherMetrics, setWeatherMetrics] = useState({});
  const [locationName, setLocationName] = useState(fallbackWeather.location);
  const [locationDetail, setLocationDetail] = useState(fallbackWeather.locationDetail);
  const [weatherStatus, setWeatherStatus] = useState('待获取天气');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [locationSearchStatus, setLocationSearchStatus] = useState('');
  const [tags, setTags] = useState(['散步']);
  const [content, setContent] = useState('');
  const [detailEntry, setDetailEntry] = useState(null);
  const [theme, setTheme] = useState('light');
  const [weatherSource, setWeatherSource] = useState('auto');
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [savedMessage, setSavedMessage] = useState('');
  const [skyOpen, setSkyOpen] = useState(false);

  const todayEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.date === todayKey)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [entries],
  );
  const sortedEntries = useMemo(
    () =>
      [...entries].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        return dateCompare || new Date(b.createdAt) - new Date(a.createdAt);
      }),
    [entries],
  );
  const selectedWeather = {
    ...getOption(weatherOptions, weather),
    temp: temperature,
    level: weatherLevel,
    profile: getSkyProfile(weather, temperature, weatherLevel),
    metrics: weatherMetrics,
  };
  const currentEncouragement = getEncouragement(mood, encouragementIndex);
  const backgroundMood = sortedEntries[0]?.mood ?? mood ?? 'calm';
  const backgroundCat = getOption(moodOptions, backgroundMood);
  const appStyle = {
    '--mood-tone': backgroundCat.tone,
    '--cat-bg': `url(${backgroundCat.catImage})`,
  };

  useEffect(() => {
    localStorage.setItem('skynote.entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  function toggleTag(tag) {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  async function updateWeatherFromLocation(coords, statusResolver) {
    try {
      const params = new URLSearchParams({
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
        current: 'temperature_2m,weather_code,wind_speed_10m,precipitation,rain,showers,snowfall,relative_humidity_2m,cloud_cover',
        timezone: 'auto',
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;
      if (!current) {
        throw new Error('Weather response missing current data');
      }
      const nextWeather = mapWeatherCode(current.weather_code, current.wind_speed_10m);
      const nextTemperature = Math.round(current.temperature_2m);
      const nextMetrics = {
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        rain: current.rain,
        showers: current.showers,
        snowfall: current.snowfall,
        humidity: current.relative_humidity_2m,
        cloudCover: current.cloud_cover,
      };
      saveLastWeatherLocation(coords);
      setWeather(nextWeather);
      setTemperature(nextTemperature);
      setWeatherLevel(getSkyLevelFromMetrics(nextWeather, nextTemperature, nextMetrics));
      setWeatherMetrics(nextMetrics);
      setLocationName(coords.location);
      setLocationDetail(coords.locationDetail || coords.location);
      setWeatherStatus(statusResolver(coords));
      return true;
    } catch {
      setWeather('cloudy');
      setTemperature(21);
      setWeatherLevel(1);
      setWeatherMetrics({});
      setLocationName(fallbackWeather.location);
      setLocationDetail(fallbackWeather.locationDetail);
      setWeatherStatus('接口失败，已使用默认值');
      return false;
    }
  }

  async function fetchCurrentWeather() {
    setWeatherSource('auto');
    setWeatherStatus('正在获取天气');

    const coords = await getCurrentPosition();
    await updateWeatherFromLocation(coords, (location) =>
      location.source === 'device'
        ? '定位成功，天气已更新'
        : location.source === 'cached'
          ? `${location.reason}，使用上次位置`
          : `${location.reason}，使用上海天气`,
    );
  }

  async function searchLocation() {
    const query = locationQuery.trim();
    if (!query) {
      setLocationSearchStatus('请输入城市或区县');
      return;
    }

    setLocationSearchStatus('正在搜索位置');
    try {
      const results = await searchWeatherLocations(query);
      setLocationResults(results);
      setLocationSearchStatus(results.length ? `找到 ${results.length} 个位置` : '没有找到匹配位置');
    } catch {
      setLocationResults([]);
      setLocationSearchStatus('位置搜索失败');
    }
  }

  async function chooseLocation(place) {
    setWeatherSource('auto');
    setWeatherStatus('正在获取天气');
    const selectedLocation = {
      latitude: place.latitude,
      longitude: place.longitude,
      location: place.location,
      locationDetail: place.locationDetail,
      source: 'manual-location',
    };
    const ok = await updateWeatherFromLocation(selectedLocation, () => '已使用你选择的位置');
    if (ok) {
      localStorage.setItem(
        'skynote.lastWeatherLocation',
        JSON.stringify({
          latitude: place.latitude,
          longitude: place.longitude,
          location: place.location,
          locationDetail: place.locationDetail,
        }),
      );
      setLocationResults([]);
      setLocationQuery(place.locationDetail);
      setLocationSearchStatus('位置已更新');
    }
  }

  function nextEncouragement() {
    setEncouragementIndex((current) => current + 1);
  }

  function changeWeather(nextWeather) {
    const option = getOption(weatherOptions, nextWeather);
    setWeather(option.id);
    setTemperature(option.temp);
    setWeatherLevel(getSkyLevelFromMetrics(option.id, option.temp));
    setWeatherMetrics({});
    setWeatherSource('manual');
  }

  function changeTemperature(nextTemperature) {
    const roundedTemperature = Math.round(nextTemperature);
    setTemperature(roundedTemperature);
    setWeatherLevel(getSkyLevelFromMetrics(weather, roundedTemperature, weatherMetrics));
    setWeatherSource('manual');
  }

  function changeWeatherLevel(nextLevel) {
    setWeatherLevel(clampSkyLevel(nextLevel));
    setWeatherMetrics({});
    setWeatherSource('manual');
  }

  function saveEntry() {
    const now = new Date().toISOString();
    const nextEntry = {
      id: `entry-${Date.now()}`,
      date: todayKey,
      mood,
      weather,
      temperature: selectedWeather.temp,
      location: locationDetail || locationName,
      content: content.trim() || '今天有一点说不清的心情，先把它放在这里。',
      tags,
      encouragement: currentEncouragement,
      weatherSource,
      weatherLevel: selectedWeather.profile.level,
      weatherMetrics,
      createdAt: now,
      updatedAt: now,
    };

    setEntries((current) => [nextEntry, ...current]);
    setSavedMessage(currentEncouragement);
    setContent('');
    setEncouragementIndex((current) => current + 1);
  }

  function updateDetailEntry(patch) {
    if (!detailEntry) return;
    const nextPatch = { ...patch };
    if (patch.mood && patch.mood !== detailEntry.mood && !patch.encouragement) {
      nextPatch.encouragement = getEncouragement(patch.mood, 0);
    }
    const updated = {
      ...detailEntry,
      ...nextPatch,
      updatedAt: new Date().toISOString(),
    };
    setDetailEntry(updated);
    setEntries((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
  }

  function deleteDetailEntry() {
    if (!detailEntry) return;
    const confirmed = window.confirm('确定删除这条记录吗？');
    if (!confirmed) return;
    setEntries((current) => current.filter((entry) => entry.id !== detailEntry.id));
    setDetailEntry(null);
  }

  function clearEntries() {
    const confirmed = window.confirm('确定清除全部记录吗？这个操作无法撤销。');
    if (!confirmed) return;
    setEntries([]);
    setDetailEntry(null);
    setSavedMessage('');
  }

  function enterApp() {
    localStorage.setItem('skynote.coverSeen', 'true');
    setCoverSeen(true);
  }

  if (!coverSeen) {
    return (
      <main className={`page theme-${theme} mood-bg-${backgroundMood}`} style={appStyle}>
        <CoverScreen onEnter={enterApp} />
      </main>
    );
  }

  return (
    <main className={`page theme-${theme} mood-bg-${backgroundMood}`} style={appStyle}>
      <section className="phone-shell" aria-label="Skynote 手机应用原型">
        <header className="app-header">
          <div>
            <p className="eyebrow">Skynote</p>
            <h1>{activeTab === 'today' ? '今天的天空' : tabTitle(activeTab)}</h1>
          </div>
          <button className="icon-button" type="button" aria-label="刷新实时天气" onClick={fetchCurrentWeather}>
            <Navigation size={18} />
          </button>
        </header>

        <div className="app-scroll">
          {activeTab === 'today' && (
            <TodayView
              content={content}
              currentEncouragement={currentEncouragement}
              mood={mood}
              selectedWeather={selectedWeather}
              locationName={locationName}
              locationDetail={locationDetail}
              tags={tags}
              savedMessage={savedMessage}
              todayEntries={todayEntries}
              weather={weather}
              weatherSource={weatherSource}
              weatherStatus={weatherStatus}
              onContentChange={setContent}
              onFetchWeather={fetchCurrentWeather}
              onMoodChange={setMood}
              onNextEncouragement={nextEncouragement}
              onOpenDetail={setDetailEntry}
              onOpenSky={() => setSkyOpen(true)}
              onSave={saveEntry}
              onTagToggle={toggleTag}
              onWeatherChange={changeWeather}
              onTemperatureChange={changeTemperature}
              onWeatherLevelChange={changeWeatherLevel}
              onWeatherSourceChange={setWeatherSource}
            />
          )}
          {activeTab === 'review' && (
            <ReviewView entries={sortedEntries} onOpenDetail={setDetailEntry} />
          )}
          {activeTab === 'trends' && <TrendsView entries={sortedEntries} />}
          {activeTab === 'settings' && (
            <SettingsView
              entriesCount={entries.length}
              locationDetail={locationDetail}
              locationQuery={locationQuery}
              locationResults={locationResults}
              locationSearchStatus={locationSearchStatus}
              theme={theme}
              weatherSource={weatherSource}
              onClearEntries={clearEntries}
              onFetchWeather={fetchCurrentWeather}
              onLocationQueryChange={setLocationQuery}
              onLocationSearch={searchLocation}
              onLocationSelect={chooseLocation}
              onThemeChange={setTheme}
              onWeatherSourceChange={setWeatherSource}
            />
          )}
        </div>

        <nav className="tab-bar" aria-label="主导航">
          <TabButton icon={PenLine} id="today" label="记录" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton icon={CalendarDays} id="review" label="回顾" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton icon={BarChart3} id="trends" label="趋势" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton icon={Settings} id="settings" label="设置" activeTab={activeTab} onClick={setActiveTab} />
        </nav>

        {detailEntry && (
          <DetailSheet
            entry={detailEntry}
            onClose={() => setDetailEntry(null)}
            onDelete={deleteDetailEntry}
            onUpdate={updateDetailEntry}
          />
        )}
        {skyOpen && (
          <SkySheet
            locationDetail={locationDetail}
            selectedWeather={selectedWeather}
            weather={weather}
            onClose={() => setSkyOpen(false)}
          />
        )}
      </section>
    </main>
  );
}

function tabTitle(tab) {
  return {
    review: '回顾',
    trends: '趋势',
    settings: '设置',
  }[tab];
}

function CoverScreen({ onEnter }) {
  return (
    <section className="phone-shell cover-shell" aria-label="Skynote 封面">
      <div className="cover-screen">
        <div className="cover-sky" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <img className="cover-cat" src="/cats/cover-cat.svg" alt="坐在阳光和云朵旁边的小猫" />
        <div className="cover-copy">
          <p className="eyebrow">Mood + Weather</p>
          <h1>Skynote</h1>
          <p>把今天的天气和心情，轻轻放进一只小猫的口袋。</p>
        </div>
        <button className="cover-enter" type="button" onClick={onEnter}>
          进入今天
        </button>
      </div>
    </section>
  );
}

function TodayView({
  content,
  currentEncouragement,
  locationName,
  locationDetail,
  mood,
  selectedWeather,
  savedMessage,
  tags,
  todayEntries,
  weather,
  weatherSource,
  weatherStatus,
  onContentChange,
  onFetchWeather,
  onMoodChange,
  onNextEncouragement,
  onOpenDetail,
  onOpenSky,
  onSave,
  onTagToggle,
  onWeatherChange,
  onTemperatureChange,
  onWeatherLevelChange,
  onWeatherSourceChange,
}) {
  const metricText = formatWeatherMetrics(weather, selectedWeather.metrics);
  const weatherSourceText = weatherSource === 'auto' ? '自动天气' : '手动天气';

  return (
    <div className="screen-stack">
      <button
        className={`weather-hero weather-${weather} ${selectedWeather.profile.className}`}
        type="button"
        onClick={onOpenSky}
        aria-label="打开动态天空"
      >
        <div className="weather-copy">
          <div className="location-line">
            <MapPin size={14} />
            {locationName} · {formatDateLabel(todayKey)}
          </div>
          <p className="location-detail">{locationDetail}</p>
          <div className="weather-main">
            <span>{selectedWeather.temp}°</span>
            <div>
              <strong>{selectedWeather.label} · {selectedWeather.profile.label}</strong>
              <p>{weatherSourceText}</p>
              {metricText && <p>{metricText}</p>}
            </div>
          </div>
        </div>
        <SkyScene
          compact
          temperature={selectedWeather.temp}
          weather={weather}
          weatherLevel={selectedWeather.profile.level}
        />
      </button>

      <section className="control-group">
        <div className="section-heading">
          <h2>心情</h2>
          <span>{todayEntries.length ? `今日 ${todayEntries.length} 条` : '还没有记录'}</span>
        </div>
        <div className="mood-grid" aria-label="选择心情">
          {moodOptions.map((item) => {
            return (
              <button
                className={`mood-button ${mood === item.id ? 'is-active' : ''}`}
                key={item.id}
                onClick={() => onMoodChange(item.id)}
                style={{ '--tone': item.tone }}
                type="button"
              >
                <img className="mood-cat" src={item.catImage} alt={item.catAlt} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="encouragement-card">
          <Sparkles size={18} />
          <p>{currentEncouragement}</p>
          <button type="button" onClick={onNextEncouragement} aria-label="换一句心情激励">
            <RefreshCw size={15} />
          </button>
        </div>
      </section>

      <section className="control-group">
        <div className="section-heading">
          <h2>天气</h2>
          <div className="segmented" aria-label="天气来源">
            <button
              className={weatherSource === 'auto' ? 'is-active' : ''}
              onClick={onFetchWeather}
              type="button"
            >
              {weatherStatus === '正在获取天气' ? <Loader2 size={13} /> : '自动'}
            </button>
            <button
              className={weatherSource === 'manual' ? 'is-active' : ''}
              onClick={() => onWeatherSourceChange('manual')}
              type="button"
            >
              手动
            </button>
          </div>
        </div>
        <div className="weather-picker" aria-label="手动选择天气">
          {weatherOptions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={weather === item.id ? 'is-active' : ''}
                key={item.id}
                onClick={() => {
                  onWeatherChange(item.id);
                }}
                type="button"
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={19} />
              </button>
            );
          })}
        </div>
        <label className="temperature-field today-temperature-field">
          <span>温度</span>
          <input
            type="number"
            value={selectedWeather.temp}
            onChange={(event) => {
              const nextTemperature = Number(event.target.value);
              if (Number.isFinite(nextTemperature)) {
                onTemperatureChange(Math.round(nextTemperature));
                onWeatherSourceChange('manual');
              }
            }}
          />
        </label>
        {weather !== 'sunny' && weather !== 'cloudy' && (
          <div className="sky-level-control" aria-label="天气强度">
            <span>天空强度</span>
            <div>
              {skyLevelLabels[weather].map((label, index) => (
                <button
                  className={selectedWeather.profile.level === index ? 'is-active' : ''}
                  key={label}
                  onClick={() => onWeatherLevelChange(index)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="entry-editor">
        <div className="section-heading">
          <h2>短记</h2>
          <span>{content.length}/180</span>
        </div>
        <textarea
          maxLength={180}
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="写一句今天想留住的话..."
        />
        <div className="tag-row" aria-label="补充标签">
          {tagOptions.map((tag) => (
            <button
              className={tags.includes(tag) ? 'is-active' : ''}
              key={tag}
              onClick={() => onTagToggle(tag)}
              type="button"
            >
              <Tag size={13} />
              {tag}
            </button>
          ))}
        </div>
        <div className="action-row">
          <button className="primary-action" onClick={onSave} type="button">
            <Check size={18} />
            保存一条
          </button>
          {todayEntries[0] && (
            <button className="secondary-action" onClick={() => onOpenDetail(todayEntries[0])} type="button">
              <Edit3 size={17} />
              最新
            </button>
          )}
        </div>
        {savedMessage && <p className="saved-message">{savedMessage}</p>}
      </section>

      {todayEntries.length > 0 && (
        <section className="list-panel">
          <div className="section-heading">
            <h2>今日记录</h2>
            <span>多次心情 / 多个天气</span>
          </div>
          <div className="entry-list today-entry-list">
            {todayEntries.map((entry) => (
              <EntryCard entry={entry} key={entry.id} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SkyScene({ compact = false, rich = false, temperature, weather, weatherLevel }) {
  const profile = getSkyProfile(weather, temperature, weatherLevel);
  const rainCount = [10, 18, 28][profile.level];
  const snowCount = [9, 16, 24][profile.level];
  const fogCount = [3, 5, 7][profile.level];
  const windCount = [3, 5, 7][profile.level];
  const catImages = moodOptions.map((item) => item.catImage);
  const decorCount = compact ? 7 : 18;
  const charmCount = compact ? 3 : 9;

  return (
    <div
      className={`sky-scene ${compact ? 'sky-scene-compact' : ''} ${rich ? 'sky-scene-rich' : ''} ${profile.className}`}
      aria-hidden="true"
    >
      <div className="sky-rainbow" />
      <div className="sky-orb">
        <span className="orb-face">
          <i />
          <i />
          <b />
        </span>
      </div>
      <div className="sky-cloud cloud-a">
        <span className="cloud-face">
          <i />
          <i />
          <b />
        </span>
      </div>
      <div className="sky-cloud cloud-b">
        <span className="cloud-face">
          <i />
          <i />
          <b />
        </span>
      </div>
      <div className="sky-cloud cloud-c">
        <span className="cloud-face">
          <i />
          <i />
          <b />
        </span>
      </div>
      <div className="sky-charms">
        {Array.from({ length: charmCount }, (_, index) => (
          <span key={index} style={{ '--i': index, '--x': `${(index * 29) % 92}%` }} />
        ))}
      </div>
      <div className="sky-sparkles">
        {Array.from({ length: decorCount }, (_, index) => (
          <span key={index} style={{ '--i': index, '--x': `${(index * 17) % 96}%`, '--y': `${8 + ((index * 19) % 58)}%` }} />
        ))}
      </div>
      {weather === 'rainy' && (
        <div className="sky-rain">
          {Array.from({ length: rainCount }, (_, index) => (
            <span
              key={index}
              style={{
                '--i': index,
                '--x': `${18 + ((index * 11) % 64)}%`,
                '--y': `${compact ? 46 + (index % 2) * 4 : 34 + (index % 5) * 4}%`,
                '--fall': `${compact ? 92 + (index % 3) * 8 : 128 + (index % 5) * 12}px`,
                '--drift': `${((index % 5) - 2) * 7}px`,
              }}
            >
              <i />
              <i />
              <b />
            </span>
          ))}
        </div>
      )}
      {weather === 'snowy' && (
        <div className="sky-snow">
          {Array.from({ length: snowCount }, (_, index) => (
            <span
              key={index}
              style={{
                '--i': index,
                '--x': `${14 + ((index * 13) % 72)}%`,
                '--y': `${compact ? 42 + (index % 3) * 5 : 30 + (index % 6) * 4}%`,
                '--fall': `${compact ? 92 + (index % 4) * 10 : 132 + (index % 6) * 14}px`,
                '--drift': `${((index % 7) - 3) * 9}px`,
              }}
            >
              <i />
            </span>
          ))}
        </div>
      )}
      {weather === 'windy' && (
        <div className="sky-wind">
          {Array.from({ length: windCount }, (_, index) => (
            <span key={index} style={{ '--i': index }} />
          ))}
        </div>
      )}
      {weather === 'foggy' && (
        <div className="sky-fog">
          {Array.from({ length: fogCount }, (_, index) => (
            <span key={index} style={{ '--i': index }} />
          ))}
        </div>
      )}
      <div className="sky-paws">
        {Array.from({ length: compact ? 3 : 8 }, (_, index) => (
          <span key={index} style={{ '--i': index }} />
        ))}
      </div>
      <div className="cat-ground">
        {catImages.concat(catImages).map((src, index) => (
          <img key={`${src}-${index}`} src={src} alt="" style={{ '--i': index, '--lift': `${index % 3}` }} />
        ))}
      </div>
    </div>
  );
}

function SkySheet({ locationDetail, selectedWeather, weather, onClose }) {
  const metricText = formatWeatherMetrics(weather, selectedWeather.metrics);

  return (
    <div className="sheet-backdrop sky-backdrop">
      <section className={`sky-sheet ${selectedWeather.profile.className}`}>
        <button className="sheet-close" type="button" onClick={onClose} aria-label="返回">
          <ChevronLeft size={20} />
        </button>
        <div className="sky-sheet-copy">
          <p>{locationDetail}</p>
          <h2>{selectedWeather.profile.label}</h2>
          <span>{selectedWeather.label} · {selectedWeather.temp}°{metricText ? ` · ${metricText}` : ''}</span>
        </div>
        <SkyScene
          rich
          temperature={selectedWeather.temp}
          weather={weather}
          weatherLevel={selectedWeather.profile.level}
        />
      </section>
    </div>
  );
}

function ReviewView({ entries, onOpenDetail }) {
  const [monthCursor, setMonthCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const year = monthCursor.getFullYear();
  const monthIndex = monthCursor.getMonth();
  const calendarDays = useMemo(() => buildMonthCells(year, monthIndex, entries), [entries, monthIndex, year]);
  const selectedDayEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.date === selectedDate)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [entries, selectedDate],
  );

  function changeMonth(offset) {
    const nextMonth = new Date(year, monthIndex + offset, 1);
    setMonthCursor(nextMonth);
    setSelectedDate(toDateKey(nextMonth));
  }

  function changeYear(nextYear) {
    if (!Number.isFinite(nextYear)) return;
    const boundedYear = Math.min(2100, Math.max(1970, Math.round(nextYear)));
    setMonthCursor(new Date(boundedYear, monthIndex, 1));
    setSelectedDate(`${boundedYear}-${String(monthIndex + 1).padStart(2, '0')}-01`);
  }

  function changeMonthSelect(nextMonthIndex) {
    if (!Number.isFinite(nextMonthIndex)) return;
    setMonthCursor(new Date(year, nextMonthIndex, 1));
    setSelectedDate(`${year}-${String(nextMonthIndex + 1).padStart(2, '0')}-01`);
  }

  return (
    <div className="screen-stack">
      <section className="calendar-panel">
        <div className="section-heading">
          <h2>{formatMonthTitle(monthCursor)}</h2>
          <span>{selectedDayEntries.length ? `${selectedDayEntries.length} 条` : '选择日期'}</span>
        </div>
        <div className="calendar-controls" aria-label="选择年月">
          <button className="month-nav" type="button" onClick={() => changeMonth(-1)} aria-label="上个月">
            <ChevronLeft size={17} />
          </button>
          <div className="calendar-current">
            <button type="button" onClick={() => changeYear(year - 1)} aria-label="上一年">
              <ChevronLeft size={14} />
            </button>
            <strong>{year}年</strong>
            <button type="button" onClick={() => changeYear(year + 1)} aria-label="下一年">
              <ChevronRight size={14} />
            </button>
            <span>{monthIndex + 1}月</span>
          </div>
          <button className="month-nav" type="button" onClick={() => changeMonth(1)} aria-label="下个月">
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="month-chip-row" aria-label="选择月份">
          {Array.from({ length: 12 }, (_, index) => (
            <button
              className={monthIndex === index ? 'is-active' : ''}
              key={index}
              onClick={() => changeMonthSelect(index)}
              type="button"
            >
              {index + 1}月
            </button>
          ))}
        </div>
        <div className="weekday-grid">
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map(({ day, entries: dayEntries, key }) => {
            const entry = dayEntries[0];
            return (
            <button
              className={`${day ? '' : 'is-empty'} ${entry ? 'has-entry' : ''} ${selectedDate === key ? 'is-selected' : ''}`}
              key={key}
              onClick={() => entry && setSelectedDate(key)}
              disabled={!day}
              style={{ '--tone': entry ? getOption(moodOptions, entry.mood).tone : '#d8ded8' }}
              type="button"
            >
              <span>{day}</span>
              {entry && (
                <span className="mood-dots" aria-hidden="true">
                  {dayEntries.slice(0, 3).map((dayEntry) => (
                    <i key={dayEntry.id} style={{ '--tone': getOption(moodOptions, dayEntry.mood).tone }} />
                  ))}
                </span>
              )}
              {dayEntries.length > 1 && <em>{dayEntries.length}</em>}
            </button>
            );
          })}
        </div>
        {selectedDayEntries.length > 0 && (
          <div className="selected-day-panel">
            <div className="section-heading">
              <h2>{formatDateLabel(selectedDate)}</h2>
              <span>{selectedDayEntries.length} 条心情</span>
            </div>
            <div className="entry-list selected-day-list">
              {selectedDayEntries.map((entry) => (
                <EntryCard entry={entry} key={entry.id} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="list-panel">
        <div className="section-heading">
          <h2>最近记录</h2>
          <span>{Math.min(entries.length, 10)} / {entries.length} 篇</span>
        </div>
        {entries.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={28} />
            <p>第一条天空笔记会出现在这里。</p>
          </div>
        ) : (
          <div className="entry-list recent-entry-list">
            {entries.slice(0, 10).map((entry) => (
              <EntryCard entry={entry} key={entry.id} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function buildMonthCells(year, monthIndex, entries) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < leadingBlanks; index += 1) {
    cells.push({ key: `blank-start-${index}`, day: null, entries: [] });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      key,
      day,
      entries: entries.filter((item) => item.date === key),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `blank-end-${cells.length}`, day: null, entries: [] });
  }

  return cells;
}

function EntryCard({ entry, onOpenDetail }) {
  const moodItem = getOption(moodOptions, entry.mood);
  const weatherItem = getOption(weatherOptions, entry.weather);
  const skyProfile = getSkyProfile(entry.weather, entry.temperature, entry.weatherLevel);
  const Icon = weatherItem.icon;
  const timeLabel = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(entry.createdAt));

  return (
    <button className="entry-card" onClick={() => onOpenDetail(entry)} type="button">
      <div className="entry-icon" style={{ '--tone': moodItem.tone }}>
        <img src={moodItem.catImage} alt="" />
        <Icon size={15} />
      </div>
      <div>
        <strong>
          {formatDateLabel(entry.date)} · {timeLabel} · {weatherItem.label} · {skyProfile.label}
        </strong>
        <p>{entry.content}</p>
        {entry.encouragement && <small>{entry.encouragement}</small>}
      </div>
    </button>
  );
}

function TrendsView({ entries }) {
  const maxScore = 5;
  const dailySummaries = buildDailyMoodSummaries(entries, 7);
  const totalRecentRecords = dailySummaries.reduce((sum, day) => sum + day.count, 0);
  const recordedDays = dailySummaries.filter((day) => day.count > 0).length;
  const averageRecentScore = totalRecentRecords
    ? dailySummaries.reduce((sum, day) => sum + day.averageScore * day.count, 0) / totalRecentRecords
    : 0;
  const recentMoodLabel = describeMoodScore(averageRecentScore, totalRecentRecords);
  const weatherCounts = weatherOptions.map((weather) => ({
    ...weather,
    count: entries.filter((entry) => entry.weather === weather.id).length,
  }));
  const maxWeatherCount = Math.max(1, ...weatherCounts.map((item) => item.count));
  const recordStreak = getRecordStreak(entries);

  return (
    <div className="screen-stack">
      <section className="trend-panel">
        <div className="section-heading">
          <h2>近 7 天</h2>
          <span>{recordedDays} 天 · {totalRecentRecords} 条</span>
        </div>
        <div className="trend-summary">
          <div>
            <strong>{recentMoodLabel}</strong>
            <span>综合状态</span>
          </div>
          <div>
            <strong>{totalRecentRecords}</strong>
            <span>记录次数</span>
          </div>
        </div>
        <div className="bar-chart daily-trend-chart" aria-label="近 7 天心情趋势">
          {dailySummaries.map((day) => {
            const moodItem = getOption(moodOptions, day.dominantMood);
            const height = day.count ? `${Math.max(14, (day.averageScore / maxScore) * 100)}%` : '6%';
            return (
              <div className={`bar-column ${day.count ? '' : 'is-empty'}`} key={day.key}>
                <div className="bar-track">
                  <span style={{ height, '--tone': moodItem.tone }} />
                  {day.count > 1 && <em>{day.count}</em>}
                </div>
                <small>{day.label}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="trend-panel">
        <div className="section-heading">
          <h2>天气关联</h2>
          <span>30 天</span>
        </div>
        <div className="weather-stats">
          {weatherCounts.map((item) => {
            const Icon = item.icon;
            return (
              <div className="stat-line" key={item.id}>
                <div>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                <meter min="0" max={maxWeatherCount} value={item.count} />
                <strong>{item.count}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="streak-panel">
        <Sparkles size={22} />
        <div>
          <strong>{recordStreak.days ? `连续记录 ${recordStreak.days} 天` : '暂无连续记录'}</strong>
          <p>
            {recordStreak.days
              ? `${formatDateLabel(recordStreak.startDate)}起，心情记录有了自己的节奏。`
              : '写下第一条记录后，这里会开始累计。'}
          </p>
        </div>
      </section>
    </div>
  );
}

function SettingsView({
  entriesCount,
  locationDetail,
  locationQuery,
  locationResults,
  locationSearchStatus,
  theme,
  weatherSource,
  onClearEntries,
  onFetchWeather,
  onLocationQueryChange,
  onLocationSearch,
  onLocationSelect,
  onThemeChange,
  onWeatherSourceChange,
}) {
  return (
    <div className="screen-stack">
      <section className="settings-panel">
        <div className="setting-row setting-location-row">
          <div className="setting-title">
            <MapPin size={18} />
            <span>定位地址</span>
          </div>
          <strong>{locationDetail}</strong>
          <div className="location-picker settings-location-picker" aria-label="选择定位地址">
            <div className="location-search-row">
              <input
                value={locationQuery}
                onChange={(event) => onLocationQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') onLocationSearch();
                }}
                placeholder="搜索城市、区县或地点"
              />
              <button type="button" onClick={onLocationSearch}>
                搜索
              </button>
              <button type="button" onClick={onFetchWeather}>
                定位
              </button>
            </div>
            {locationSearchStatus && <p>{locationSearchStatus}</p>}
            {locationResults.length > 0 && (
              <div className="location-result-list">
                {locationResults.map((place) => (
                  <button key={place.id} type="button" onClick={() => onLocationSelect(place)}>
                    <MapPin size={13} />
                    <span>{place.locationDetail}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <SettingRow icon={CloudSun} title="天气来源">
          <div className="segmented">
            <button
              className={weatherSource === 'auto' ? 'is-active' : ''}
              onClick={() => onWeatherSourceChange('auto')}
              type="button"
            >
              自动
            </button>
            <button
              className={weatherSource === 'manual' ? 'is-active' : ''}
              onClick={() => onWeatherSourceChange('manual')}
              type="button"
            >
              手动
            </button>
          </div>
        </SettingRow>
        <SettingRow icon={Moon} title="主题模式">
          <div className="segmented">
            <button
              className={theme === 'light' ? 'is-active' : ''}
              onClick={() => onThemeChange('light')}
              type="button"
            >
              浅色
            </button>
            <button
              className={theme === 'dark' ? 'is-active' : ''}
              onClick={() => onThemeChange('dark')}
              type="button"
            >
              深色
            </button>
          </div>
        </SettingRow>
        <div className="setting-row danger-row">
          <div className="setting-title">
            <Trash2 size={18} />
            <span>清除记录</span>
          </div>
          <button className="danger-action" onClick={onClearEntries} type="button" disabled={entriesCount === 0}>
            {entriesCount} 条
          </button>
        </div>
      </section>
    </div>
  );
}

function SettingRow({ children, icon: Icon, title, value }) {
  return (
    <div className="setting-row">
      <div className="setting-title">
        <Icon size={18} />
        <span>{title}</span>
      </div>
      {children ?? <strong>{value}</strong>}
    </div>
  );
}

function DetailSheet({ entry, onClose, onDelete, onUpdate }) {
  const moodItem = getOption(moodOptions, entry.mood);
  const weatherItem = getOption(weatherOptions, entry.weather);
  const WeatherIcon = weatherItem.icon;
  const skyProfile = getSkyProfile(entry.weather, entry.temperature, entry.weatherLevel);

  function toggleEntryTag(tag) {
    const nextTags = entry.tags.includes(tag)
      ? entry.tags.filter((item) => item !== tag)
      : [...entry.tags, tag];
    onUpdate({ tags: nextTags });
  }

  return (
    <div className="sheet-backdrop">
      <section className={`detail-sheet weather-${entry.weather} ${skyProfile.className}`}>
        <button className="sheet-close" type="button" onClick={onClose} aria-label="返回">
          <ChevronLeft size={20} />
        </button>
        <div className="detail-top">
          <div>
            <p>{formatDateLabel(entry.date)}</p>
            <h2>{moodItem.label}的一天</h2>
          </div>
          <div className="detail-weather">
            <WeatherIcon size={22} />
            <span>{weatherItem.label} · {entry.temperature}° · {skyProfile.label}</span>
          </div>
        </div>
        <div className="detail-edit-grid">
          <div>
            <p className="detail-label">心情</p>
            <div className="mood-grid detail-mood-grid">
              {moodOptions.map((item) => {
                return (
                  <button
                    className={`mood-button ${entry.mood === item.id ? 'is-active' : ''}`}
                    key={item.id}
                    onClick={() => onUpdate({ mood: item.id })}
                    style={{ '--tone': item.tone }}
                    type="button"
                  >
                    <img className="mood-cat" src={item.catImage} alt={item.catAlt} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="detail-label">天气</p>
            <div className="weather-picker detail-weather-picker">
              {weatherOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    className={entry.weather === item.id ? 'is-active' : ''}
                    key={item.id}
                    onClick={() =>
                      onUpdate({
                        weather: item.id,
                        temperature: item.temp,
                        weatherLevel: getSkyLevelFromMetrics(item.id, item.temp),
                        weatherMetrics: {},
                        weatherSource: 'manual',
                      })
                    }
                    type="button"
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon size={17} />
                  </button>
                );
              })}
            </div>
          </div>
          <label className="temperature-field">
            <span>温度</span>
            <input
              type="number"
              value={entry.temperature}
              onChange={(event) => {
                const nextTemperature = Number.isFinite(Number(event.target.value))
                  ? Math.round(Number(event.target.value))
                  : entry.temperature;
                onUpdate({
                  temperature: nextTemperature,
                  weatherLevel: getSkyLevelFromMetrics(entry.weather, nextTemperature, entry.weatherMetrics),
                  weatherSource: 'manual',
                });
              }}
            />
          </label>
          {entry.weather !== 'sunny' && entry.weather !== 'cloudy' && (
            <div className="sky-level-control detail-sky-level-control" aria-label="记录天气强度">
              <span>天空强度</span>
              <div>
                {skyLevelLabels[entry.weather].map((label, index) => (
                  <button
                    className={skyProfile.level === index ? 'is-active' : ''}
                    key={label}
                    onClick={() =>
                      onUpdate({
                        weatherLevel: index,
                        weatherMetrics: {},
                        weatherSource: 'manual',
                      })
                    }
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <textarea
          value={entry.content}
          onChange={(event) => onUpdate({ content: event.target.value })}
          aria-label="编辑日记内容"
        />
        <div className="tag-row detail-tags" aria-label="编辑标签">
          {tagOptions.map((tag) => (
            <button
              className={entry.tags.includes(tag) ? 'is-active' : ''}
              key={tag}
              onClick={() => toggleEntryTag(tag)}
              type="button"
              style={{ '--tone': moodItem.tone }}
            >
              <Tag size={13} />
              {tag}
            </button>
          ))}
        </div>
        {entry.encouragement && <p className="detail-encouragement">{entry.encouragement}</p>}
        <button className="delete-entry" onClick={onDelete} type="button">
          <Trash2 size={16} />
          删除这条
        </button>
      </section>
    </div>
  );
}

function TabButton({ activeTab, icon: Icon, id, label, onClick }) {
  return (
    <button
      className={activeTab === id ? 'is-active' : ''}
      onClick={() => onClick(id)}
      type="button"
      aria-label={label}
      title={label}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

export default App;
