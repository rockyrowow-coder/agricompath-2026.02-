/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Camera, Star, Send, Lock, Search, Home, Plus, User, X, ChevronRight, Sprout, Users, FileText, BadgeCheck, Filter, MessageSquare, Medal, ThumbsUp, Hash, UserPlus, Award, Images, ClipboardList, Tractor, PenTool, ArrowLeft, MapPin, Heart, MessageCircle, CheckCircle2, Flame, Mic, Settings, Bell, Globe, AlertCircle, ShoppingCart, Check, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { subDays, isAfter } from 'date-fns';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

/**
 * MOCK DATA
 */
const currentUser = {
  id: 'u1',
  name: 'あなた',
  avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  isCertified: true,
  followers: 120,
  following: 85,
  posts: 42,
  badges: ['certified', 'top-contributor'],
  selfPromo: '有機野菜を中心に栽培しています。減農薬に挑戦中！',
  location: '千葉県',
  crops: ['トマト', 'きゅうり', 'ナス', 'ピーマン', 'オクラ'],
  experience: '10年'
};

const INITIAL_POSTS = [
  {
    id: 1,
    type: "review", // review or post
    author: { id: 'u2', name: "田中農園", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cfdfeeab?q=80&w=100&auto=format&fit=crop", isCertified: true },
    attribute: "専業 / トマト・キュウリ",
    category: "農薬",
    material: "アファーム乳剤",
    rating: 5,
    timestamp: "2時間前",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=600&auto=format&fit=crop",
    content: "オオタバコガに即効性あり。収穫前日まで使えるのが神。夕方の散布推奨。",
    tags: ["殺虫剤", "野菜全般"],
    likes: 56, // ゴールドランク相当
    comments: 3,
    community: '施設園芸 意見交換会'
  },
  {
    id: 4,
    type: "post",
    author: { id: 'u3', name: "サトウ@トマト専業", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop", isCertified: false },
    attribute: "専業 / トマト",
    category: "その他",
    material: "今日のハウス",
    rating: null,
    timestamp: "昨日",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=600&auto=format&fit=crop",
    content: "急に冷え込んできたので、今夜から暖房機稼働させます。燃料代が怖い時期になってきた...🥲",
    tags: ["日常", "温度管理"],
    likes: 12,
    comments: 1,
    community: '【関東】新規就農者の集い'
  },
  {
    id: 2,
    type: "review",
    author: currentUser, // デモ用：最初からいくつか「いいね」を持たせる
    attribute: "兼業 / 果樹",
    category: "肥料",
    material: "マイガーデンベジフル",
    rating: 4,
    timestamp: "2023/10/20",
    image: "https://images.unsplash.com/photo-1416879598555-52026858e7d2?q=80&w=600&auto=format&fit=crop",
    content: "元肥として使用。じわじわ効く感じで根焼けの心配が少ないのが良い。",
    tags: ["化成肥料", "元肥"],
    likes: 15, // シルバーランク相当
    comments: 0,
    community: 'スマート農業導入事例'
  },
  {
    id: 3,
    type: "review",
    author: { id: 'u4', name: "鈴木ファーム", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop", isCertified: true },
    attribute: "兼業 / 水稲・露地野菜",
    category: "種苗",
    material: "キャベツ種『みさき』",
    rating: 5,
    timestamp: "2023/10/23",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop",
    content: "とんがり頭の極早生。柔らかくて甘みが強いので直売所で大人気です。定植から50日ちょっとで収穫できる回転の速さも魅力。",
    tags: ["品種レビュー", "キャベツ"],
    likes: 38,
    comments: 2,
    community: '施設園芸 意見交換会'
  },
  {
    id: 5,
    type: "album",
    author: { id: 'u5', name: "アグリテック", avatarUrl: "https://images.unsplash.com/photo-1507003211169-e695c6edd65d?q=80&w=100&auto=format&fit=crop", isCertified: false },
    attribute: "法人 / 施設野菜",
    category: "その他",
    material: "スマート農業導入事例",
    rating: null,
    timestamp: "3日前",
    image: "https://images.unsplash.com/photo-1517457210348-b7c0f601773f?q=80&w=600&auto=format&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1517457210348-b7c0f601773f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457210348-b7c0f601773f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457210348-b7c0f601773f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457210348-b7c0f601773f?q=80&w=600&auto=format&fit=crop",
    ],
    content: "AIを活用した自動栽培システムを導入しました。水やりや肥料の調整が自動化され、作業効率が大幅に向上！",
    tags: ["スマート農業", "AI", "自動化"],
    likes: 25,
    comments: 5,
    community: 'スマート農業導入事例'
  }
];

const RECOMMENDED_ITEMS = [
  { id: 101, type: '資材', name: '微生物農薬 ボトキラー', desc: 'これからの季節の灰色かび病対策に' },
  { id: 102, type: 'トレンド', name: '#秋の土づくり', desc: 'みんなの堆肥の選び方をチェック' },
  { id: 103, type: '種苗', name: '耐病性ブロッコリー種', desc: '黒腐病に強い最新品種' }
];

const COMMUNITIES = [
  { id: 1, name: '千葉アクアメロン生産者コミュニティ', members: 128, active: true },
  { id: 2, name: 'あら川の桃生産者コミュニティ', members: 45, active: false },
  { id: 3, name: 'スマート農業導入事例', members: 312, active: true },
];

const MOCK_FRIENDS = [
  { name: '田中農園', avatarId: '1535713875002-d1d0cfdfeeab', location: '千葉県', mainCrop: 'トマト', exp: '専業', desc: '専業 / トマト / 千葉県' },
  { name: '鈴木ファーム', avatarId: '1544005313-94ddf0286df2', location: '新潟県', mainCrop: '水稲', exp: '兼業', desc: '兼業 / 水稲 / 新潟県' },
  { name: '山田農園', avatarId: '1500648767791-00dcc994a43e', location: '長野県', mainCrop: 'レタス', exp: '専業', desc: '専業 / レタス / 長野県' }
];

const MOCK_MATERIALS = [
  { id: 1, name: 'ダコニール1000', category: '殺虫剤', rating: 4.5 },
  { id: 2, name: 'スミチオン水和剤', category: '殺菌剤', rating: 4.2 },
  { id: 3, name: 'ベストガード粒剤', category: '殺虫剤', rating: 3.8 },
  { id: 4, name: 'ストロビーフロアブル', category: '殺虫剤', rating: 4.6 },
  { id: 5, name: 'トレボン乳剤', category: '殺菌剤', rating: 4.0 },
  { id: 6, name: 'アミスター20フロアブル', category: '殺虫剤', rating: 4.3 },
  { id: 7, name: 'オルトラン水和剤', category: '殺菌剤', rating: 3.9 },
  { id: 8, name: 'マインフレッシュ粒剤', category: '肥料', rating: 4.1 },
  { id: 9, name: 'ハイポネックス口匠', category: '肥料', rating: 4.7 },
  { id: 10, name: 'ネキリンエース水和剤', category: '殺虫剤', rating: 4.4 },
  { id: 11, name: 'プレバソンフロアブル5', category: '殺虫剤', rating: 4.8 },
  { id: 12, name: 'ランマンフロアブル', category: '殺菌剤', rating: 4.0 },
  { id: 13, name: 'スコア額剤フロアブル', category: '殺虫剤', rating: 4.5 },
  { id: 14, name: 'ZZボルドー水和剤', category: '殺菌剤', rating: 3.7 },
  { id: 15, name: 'スターナ9', category: '除草剤', rating: 4.2 },
  { id: 16, name: 'ラウンドアップマックスロード', category: '除草剤', rating: 4.6 },
  { id: 17, name: 'バスタード液剤', category: '除草剤', rating: 3.5 },
  { id: 18, name: 'くみあい防虫ネット', category: '資材', rating: 4.3 },
  { id: 19, name: 'タキイ種頻交配', category: '種苗', rating: 4.9 },
  { id: 20, name: 'ヨヒサンビックリー', category: '肥料', rating: 4.0 },
];

const TARGET_TAGS: Record<string, string[]> = {
  '農薬': ['害虫', '病気', '雑草', '予防'],
  '肥料': ['元肥', '追肥', '葉面散布', '土壌改良'],
  '種苗': ['春まき', '夏秋', '越冬', '耐病性'],
  'その他': ['被覆資材', '誘引', '農機具', 'その他']
};

const getPostTypeInfo = (type: string) => {
  switch (type) {
    case 'review': return { label: 'レビュー', icon: Star, color: 'text-yellow-400' };
    case 'blog': return { label: 'ブログ', icon: PenTool, color: 'text-blue-400' };
    case 'harvest': return { label: '収穫記録', icon: Tractor, color: 'text-orange-400' };
    case 'diary': return { label: '作業日誌', icon: ClipboardList, color: 'text-emerald-400' };
    case 'tweet': return { label: 'つぶやき', icon: MessageSquare, color: 'text-sky-400' };
    case 'photo': return { label: '写真', icon: Camera, color: 'text-rose-400' };
    case 'album': return { label: 'アルバム', icon: Images, color: 'text-purple-400' };
    default: return { label: '投稿', icon: MessageSquare, color: 'text-stone-400' };
  }
};

// Confetti Component for "Game-feel" feedback
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex justify-center items-start overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-3 h-3 bg-red-500 rounded-full animate-fall"
          style={{
            left: `${Math.random() * 100}% `,
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
            animationDuration: `${Math.random() * 2 + 1} s`,
            animationDelay: `${Math.random() * 0.5} s`
          }}
        />
      ))}
      <style>{`
@keyframes fall {
  0 % { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100 % { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
        .animate - fall {
  animation: fall linear forwards;
}
        /* Hide scrollbar for horizontal scrolling */
        .no - scrollbar:: -webkit - scrollbar {
  display: none;
}
        .no - scrollbar {
  -ms - overflow - style: none;
  scrollbar - width: none;
}
`}</style>
    </div>
  );
};

export default function App() {
  const { user, profile, loading, signUp, signIn, signInWithGoogle, signOut } = useAuth();

  // Auth UI State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State
  const [hasPosted, setHasPosted] = useState(false);  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'community', 'add', 'messages', 'mypage'
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);

  // UI Ext State
  const [searchTab, setSearchTab] = useState('materials'); // 'materials', 'farmers'
  const [homeTab, setHomeTab] = useState('recommended'); // 'recommended', 'ranking', 'news', 'trend'
  const [profilePostFilter, setProfilePostFilter] = useState('all');
  const [profilePostSort, setProfilePostSort] = useState('newest');
  const [trendRange, setTrendRange] = useState('week'); // 'day', 'week', 'month'

  // Friends sub-view state
  const [friendSubView, setFriendSubView] = useState<string | null>(null); // null, 'likes', 'comments', 'messages', 'follows'
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');

  // Mock data for messages
  const [mockMessages] = useState([
    {
      id: 'm1', user: { name: '田中農園', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cfdfeeab?q=80&w=100&auto=format&fit=crop' }, lastMessage: 'トマトの苗、今年はどこで買いましたか？', time: '2時間前', unread: 2, messages: [
        { from: 'them', text: 'こんにちは！トマトの苗、今年はどこで買いましたか？', time: '14:20' },
        { from: 'me', text: '今年はJAで買いましたよ！桃太郎とアイコの2品種です', time: '14:25' },
        { from: 'them', text: 'トマトの苗、今年はどこで買いましたか？', time: '14:30' },
      ]
    },
    {
      id: 'm2', user: { name: '鈴木ファーム', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' }, lastMessage: 'お疲れ様です！収穫おめでとうございます🎉', time: '昨日', unread: 0, messages: [
        { from: 'me', text: '今日初収穫でした！', time: '10:00' },
        { from: 'them', text: 'お疲れ様です！収穫おめでとうございます🎉', time: '10:15' },
      ]
    },
  ]);

  // Mock data for follow requests
  const [followRequests, setFollowRequests] = useState([
    { id: 'fr1', user: { name: '田中ファーム', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', attribute: '専業 / トマト', location: '千葉県' }, status: 'pending' },
    { id: 'fr2', user: { name: '山田農園', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop', attribute: '兼業 / 水稲', location: '新潟県' }, status: 'pending' },
  ]);

  // Hashtag input state
  const [hashtagInput, setHashtagInput] = useState('');
  const [postTags, setPostTags] = useState<string[]>([]);

  // Album photos state
  const [albumPhotos, setAlbumPhotos] = useState<string[]>([]);

  // Visibility checkboxes - communities
  const [visibleCommunities, setVisibleCommunities] = useState<string[]>([]);

  // Multiple photos state (up to 5)
  const [postPhotos, setPostPhotos] = useState<string[]>([]);
  const [photoLabels, setPhotoLabels] = useState<string[]>([]);

  // Search state
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchSort, setSearchSort] = useState('newest'); // 'newest', 'likes', 'oldest'
  const [searchFilter, setSearchFilter] = useState('all'); // 'all', 'review', 'photo', 'blog', 'diary', 'purchase'
  const [hasSearched, setHasSearched] = useState(false);

  // Community join/leave state
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(['トマト部', '水稲部']);

  // Toast notification for coming soon features
  const [toastMessage, setToastMessage] = useState('');
  const showComingSoon = (feature?: string) => {
    setToastMessage(feature ? `${feature}は準備中です` : 'この機能は準備中です');
    setTimeout(() => setToastMessage(''), 2500);
  };

  // UI State for Community
  const [communityTab, setCommunityTab] = useState('timeline'); // 'timeline', 'manage'
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDesc, setNewCommunityDesc] = useState('');
  // const [selectedCommunity, setSelectedCommunity] = useState(null);

  // My Page State
  // const [myPageFilter, setMyPageFilter] = useState('all'); // 'all', 'photo', 'album', 'review', 'blog', 'tweet', 'harvest'
  const [isCertifiedSaved, setIsCertifiedSaved] = useState(currentUser.isCertified);

  // Profile State (remaining from original, certifiedNumber is still here)
  const [activeProfileTab, setActiveProfileTab] = useState('posts'); // posts, drafts, friends, settings
  const [certifiedNumber, setCertifiedNumber] = useState('');
  const [certificationStatus, setCertificationStatus] = useState('none'); // 'none', 'pending', 'approved'

  // Crop Registration State
  const [myCrops, setMyCrops] = useState<string[]>(currentUser.crops || []);
  const [cropLastUpdated, setCropLastUpdated] = useState<string | null>(null);
  const [newCropInput, setNewCropInput] = useState('');

  // Drafts state
  const [drafts, setDrafts] = useState<any[]>([]);

  // Public Profile State
  const [viewedUser, setViewedUser] = useState<any>(null);

  // Helper functions for checking post activity
  const checkHasPostedRecently = () => {
    // Check if user has posted in the last 7 days
    const oneWeekAgo = subDays(new Date(), 7);
    const userPosts = posts.filter(p => p.author.id === currentUser.id);

    if (userPosts.length === 0) return false;

    // For mock data, we'll check the timestamp string.
    // In a real app, this would parse actual date objects.
    const mostRecentPost = userPosts[0];

    // If it says "時間前" or "日前", it's recent enough for our demo
    if (mostRecentPost.timestamp.includes('前') || mostRecentPost.timestamp.includes('昨日')) {
      return true;
    }

    // For "YYYY/MM/DD" format, parse and compare
    try {
      const [year, month, day] = mostRecentPost.timestamp.split('/').map(Number);
      const postDate = new Date(year, month - 1, day); // month is 0-indexed
      return isAfter(postDate, oneWeekAgo);
    } catch (e) {
      // Fallback for unparseable dates, assume recent for demo
      return true;
    }
  };

  useEffect(() => {
    setHasPosted(checkHasPostedRecently());
  }, [posts]);

  // Form State
  const [postMode, setPostMode] = useState('review'); // review, post
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [materialName, setMaterialName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('農薬'); // 農薬, 肥料, 種苗, その他
  const [reviewRating, setReviewRating] = useState(0);  // My Rank info based on total likes
  const getRankInfo = (likes: number) => {
    if (likes >= 1000) return { name: 'ゴールド', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', iconColor: 'text-yellow-500' };
    if (likes >= 500) return { name: 'シルバー', bgColor: 'bg-stone-100', borderColor: 'border-stone-300', iconColor: 'text-stone-400' };
    return { name: 'ブロンズ', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', iconColor: 'text-amber-600' };
  };
  const myTotalLikes = currentUser.posts * 5; // Simplified mock logic
  const myRank = getRankInfo(myTotalLikes); // Renamed from rating
  const [reviewText, setReviewText] = useState(''); // For review mode

  // 新規追加したフォーム用のState
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [reviewMaterial, setReviewMaterial] = useState(''); // New for review form
  const [reviewTiming, setReviewTiming] = useState(''); // New for review form
  const [reviewTemp, setReviewTemp] = useState(''); // New for review form
  const [reviewTarget, setReviewTarget] = useState(''); // New for review form
  const [postTitle, setPostTitle] = useState(''); // For blog/album
  const [postText, setPostText] = useState(''); // For other post types
  const [harvestAmount, setHarvestAmount] = useState(''); // For harvest
  const [workTime, setWorkTime] = useState(''); // For diary
  const [purchaseAmount, setPurchaseAmount] = useState(''); // For purchase
  const [postVisibility, setPostVisibility] = useState('community'); // 'community', 'public', 'followers', 'draft'

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Image Upload Mock
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Submit Logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(async () => {
      // モードに応じたタイトル/資材名の生成
      let finalMaterial = "日常の投稿";
      if (postMode === 'review') finalMaterial = reviewMaterial;
      else if (postMode === 'blog' || postMode === 'album') finalMaterial = postTitle;
      else if (postMode === 'harvest') finalMaterial = `${materialName} (収量: ${harvestAmount})`;
      else if (postMode === 'diary') finalMaterial = `${materialName} (時間: ${workTime})`;

      let finalReviewText = reviewText;
      if (postMode === 'review') {
        const extras = [];
        if (reviewTiming) extras.push(`【時期】${reviewTiming} `);
        if (reviewTemp) extras.push(`【気温】${reviewTemp} `);
        if (reviewTarget) extras.push(`【対象】${reviewTarget} `);
        if (extras.length > 0) {
          finalReviewText = `${extras.join(' ')} \n\n${reviewText} `;
        }
      }

      const newPost = {
        id: Date.now(),
        type: postMode,
        author: currentUser,
        attribute: "マイプロフィール設定",
        category: postMode === 'review' ? selectedCategory : "その他",
        material: finalMaterial || "未設定",
        rating: postMode === 'review' ? reviewRating : null,
        timestamp: "たった今",
        image: photoPreview || "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600&auto=format&fit=crop",
        content: postMode === 'review' ? finalReviewText : postText,
        tags: ["新規投稿"],
        likes: 0,
        comments: 0,
        community: '未設定'
      };

      // Save to Supabase
      if (user) {
        await supabase.from('posts').insert({
          author_id: user.id,
          type: postMode,
          category: postMode === 'review' ? selectedCategory : 'その他',
          material: finalMaterial || '未設定',
          rating: postMode === 'review' ? reviewRating : null,
          content: postMode === 'review' ? finalReviewText : postText,
          image_url: photoPreview || null,
          tags: postTags.length > 0 ? postTags : ['新規投稿'],
          visibility: postVisibility === 'draft' ? 'draft' : (visibleCommunities.length > 0 ? 'community' : 'public'),
          is_draft: postVisibility === 'draft',
          community: visibleCommunities.join(', ') || '未設定'
        });
      }

      if (postVisibility === 'draft') {
        setDrafts([newPost, ...drafts]);
        setIsSubmitting(false);
        setShowConfetti(true);
      } else {
        setPosts([newPost, ...posts]);
        setHasPosted(true);
        setIsSubmitting(false);
        setShowConfetti(true);
      }

      // Reset Form
      setMaterialName('');
      setReviewRating(0);
      setReviewText('');
      setPhotoPreview(null);
      setPostTitle('');
      setHarvestAmount('');
      setWorkTime('');
      setReviewMaterial('');
      setReviewTiming('');
      setReviewTemp('');
      setReviewTarget('');
      setPostText('');
      setPostVisibility('community');

      setTimeout(() => {
        setShowConfetti(false);
        if (postVisibility !== 'draft') {
          setActiveTab('home');
        } else {
          setActiveProfileTab('drafts');
          setActiveTab('profile');
        }
      }, 2500);
    }, 1000);
  };

  const handlePostClick = (post: any) => {
    if (!hasPosted && post.author.id !== currentUser.id && post.type === "review") {
      setShowLockModal(true);
    } else {
      setSelectedPost(post);
    }
  };

  // 円形メニューのアイテム選択時のハンドリング
  const handleMenuClick = (type: string) => {
    setShowPostMenu(false);
    setPostMode(type);
    setActiveTab('record');
  };

  // カテゴリ変更時のリセット処理
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTarget('');
    setSearchQuery('');
    setReviewMaterial(''); // Use reviewMaterial here
  };

  // 検索サジェストの生成
  const suggestedMaterials = MOCK_MATERIALS.filter(m =>
    m.category === selectedCategory &&
    (!selectedTarget || m.target === selectedTarget) &&
    (!searchQuery || m.name.includes(searchQuery))
  );

  // User Rank Logic
  const myPosts = posts.filter(p => p.author.id === currentUser.id);
  // const myTotalLikes = myPosts.reduce((sum, post) => sum + (post.likes || 0), 0); // This was replaced by the user's instruction

  const renderUserBadge = (isCert: boolean, likes: number) => {
    const rank = getRankInfo(likes);
    return (
      <div className="flex items-center gap-1">
        {isCert && <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-100" />}
        <Medal className={`w-4 h-4 ${rank.iconColor}`} />
      </div>
    );
  };

  /* DUMMY_COMMENT_1 */
  // Public Profile Component
  const PublicProfileView = ({ user, onClose }: { user: any, onClose: any }) => {
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    let userPosts = posts.filter(p => p.author.name === user.name || p.author.id === user.id);
    if (filterCategory !== 'all') {
      userPosts = userPosts.filter(p => p.type === filterCategory);
    }
    if (sortOrder === 'likes') {
      userPosts.sort((a, b) => b.likes - a.likes);
    } else {
      userPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return (
      <div className="fixed inset-0 z-50 bg-stone-100 overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-4 py-3 flex items-center shadow-md sticky top-0 z-10 pt-safe">
          <button onClick={onClose} className="mr-3 p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="font-bold flex-1 text-center pr-9">プロフィール</div>
        </div>

        {/* Profile Info */}
        <div className="bg-white px-4 py-6 border-b border-stone-200 shadow-sm relative mb-2">
          <div className="flex items-start">
            <div className="relative mr-4">
              <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
              {user.isCertified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                </div>
              )}
            </div>
            <div className="flex-1 pt-1">
              <h2 className="text-xl font-bold text-stone-800 mb-1">{user.name}</h2>
              {user.isCertified && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center mb-2 font-medium border border-emerald-100">
                  <Award className="w-3 h-3 mr-1" />
                  認定農業者
                </span>
              )}
              {user.location && (
                <div className="text-sm text-stone-600 flex items-center mb-1">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {user.location}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 text-center divide-x divide-stone-100 bg-stone-50 rounded-xl py-3 border border-stone-100">
            <div>
              <div className="text-lg font-bold text-stone-800">{user.posts || userPosts.length}</div>
              <div className="text-xs text-stone-500">投稿</div>
            </div>
            <div>
              <div className="text-lg font-bold text-stone-800">{user.followers || 0}</div>
              <div className="text-xs text-stone-500">フォロワー</div>
            </div>
            <div>
              <div className="text-lg font-bold text-stone-800">{user.following || 0}</div>
              <div className="text-xs text-stone-500">フォロー中</div>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-emerald-600 text-white rounded-full py-2 font-bold text-sm shadow-sm active:scale-95 transition-transform">
              フォローする
            </button>
            <button className="flex-1 bg-stone-100 text-stone-700 rounded-full py-2 font-bold text-sm shadow-sm active:scale-95 transition-transform border border-stone-200">
              メッセージ
            </button>
          </div>

          {user.selfPromo && (
            <div className="mt-4 text-sm text-stone-700">
              <p>{user.selfPromo}</p>
            </div>
          )}
        </div>

        {/* User's Posts */}
        <div className="pb-safe">
          <div className="bg-white px-4 py-3 border-b border-stone-200 shadow-sm sticky top-14 z-10 flex flex-col gap-2">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-stone-500 mr-2" />
              <h3 className="font-bold text-stone-800 text-sm">投稿一覧</h3>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-stone-50 border-none text-xs font-bold text-stone-700 outline-none rounded-lg px-2 py-1">
                <option value="all">すべて</option>
                <option value="photo">写真</option>
                <option value="album">アルバム</option>
                <option value="review">レビュー</option>
                <option value="blog">ブログ</option>
                <option value="harvest">収穫</option>
              </select>
              <div className="flex-1"></div>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-stone-50 border-none text-xs font-bold text-stone-700 outline-none rounded-lg px-2 py-1">
                <option value="newest">新しい順</option>
                <option value="likes">いいね順</option>
              </select>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {userPosts.map(post => renderPostCard(post))}
          </div>
          {userPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400 bg-white">
              <FileText className="w-12 h-12 mb-4" />
              <p>投稿はまだありません。</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPostCard = (post: any, index?: number, isRanking: boolean = false) => (
    <div
      key={post.id}
      onClick={() => handlePostClick(post)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer border border-stone-100 relative mb-4"
    >
      {isRanking && index !== undefined && (
        <div className="absolute top-2 left-2 z-20 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
          {index + 1}
        </div>
      )}
      <div className="relative h-40 bg-stone-200">
        <img src={post.image} alt={post.material || post.title || '投稿画像'} className="w-full h-full object-cover" />
        <div className={`absolute ${isRanking ? 'top-2 right-2' : 'top-2 left-2'} bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1 z-10`}>
          {(() => {
            const info = getPostTypeInfo(post.type);
            const Icon = info.icon;
            return (
              <>
                <Icon className={`w-3 h-3 ${info.color} ${post.type === 'review' ? 'fill-current' : ''}`} />
                {info.label}
              </>
            );
          })()}
        </div>
        {post.type === 'review' && post.category && (
          <div className={`absolute ${isRanking ? 'bottom-2 right-2' : 'top-2 right-2'} bg-emerald-500/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm z-10`}>
            {post.category}
          </div>
        )}
        {post.type === 'review' && post.rating && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center shadow-sm z-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < post.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}`} />
            ))}
            <span className="ml-1 text-xs font-bold text-stone-700">{post.rating}.0</span>
          </div>
        )}
        {!hasPosted && post.author?.id !== currentUser.id && post.type === "review" && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-black/40 z-20" onClick={(e) => { e.stopPropagation(); setShowLockModal(true); }}>
            <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">投稿してロック解除</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-stone-800 leading-tight">{post.material || post.title || post.content?.substring(0, 15)}</h3>
          <span className="text-[10px] text-stone-400">{post.timestamp}</span>
        </div>
        {post.author && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden cursor-pointer" onClick={(e) => {
              e.stopPropagation();
              setViewedUser({ name: post.author.name, avatarUrl: post.author.avatarUrl, isCertified: post.author.isCertified, selfPromo: '', location: '', crops: [], experience: '', posts: posts.filter(p => p.author?.name === post.author.name).length, followersCount: Math.floor(Math.random() * 200), followingCount: Math.floor(Math.random() * 50) });
            }}>
              <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-stone-600 font-medium cursor-pointer hover:underline" onClick={(e) => {
              e.stopPropagation();
              setViewedUser({ name: post.author.name, avatarUrl: post.author.avatarUrl, isCertified: post.author.isCertified, selfPromo: '', location: '', crops: [], experience: '', posts: posts.filter(p => p.author?.name === post.author.name).length, followersCount: Math.floor(Math.random() * 200), followingCount: Math.floor(Math.random() * 50) });
            }}>{post.author.name}</span>
            {renderUserBadge(post.author.isCertified, post.likes)}
          </div>
        )}
        <p className={`text-sm text-stone-600 line-clamp-2 ${!hasPosted && post.author?.id !== currentUser.id && post.type === "review" ? "blur-sm select-none" : ""}`}>
          {post.content}
        </p>
        <div className="mt-3 flex gap-4 text-stone-400 text-xs font-medium">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" /> {post.likes}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> {post.comments}
          </div>
        </div>
      </div>
    </div>
  );

  // Supabase data fetch effects
  useEffect(() => {
    if (!user) return;
    // Fetch posts from Supabase
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles:author_id(name, avatar_url, is_certified)')
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
        .limit(50);
      if (data && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          type: p.type,
          author: { id: p.author_id, name: p.profiles?.name || '不明', avatarUrl: p.profiles?.avatar_url || '', isCertified: p.profiles?.is_certified || false },
          attribute: '',
          category: p.category,
          material: p.material,
          rating: p.rating,
          timestamp: new Date(p.created_at).toLocaleDateString('ja-JP'),
          image: p.image_url || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600&auto=format&fit=crop',
          content: p.content,
          tags: p.tags || [],
          likes: 0,
          comments: 0,
          community: p.community || ''
        }));
        setPosts(prev => [...mapped, ...INITIAL_POSTS]);
      }
    };
    fetchPosts();
  }, [user]);

  // Auth handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        await signUp(authEmail, authPassword, authName);
      } else {
        await signIn(authEmail, authPassword);
      }
    } catch (err: any) {
      setAuthError(err.message || '認証エラーが発生しました');
    }
    setAuthLoading(false);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-stone-100 font-sans text-stone-800 max-w-md mx-auto shadow-2xl items-center justify-center">
        <Sprout className="w-12 h-12 text-emerald-600 animate-pulse mb-4" />
        <p className="text-stone-500 font-bold">読み込み中...</p>
      </div>
    );
  }

  // Auth screen
  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-600 to-emerald-800 font-sans text-white max-w-md mx-auto shadow-2xl overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[100vh]">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Sprout className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-wider mb-1">AgriReview</h1>
            <p className="text-emerald-200 text-sm">農家のための資材レビュープラットフォーム</p>
          </div>

          {/* Auth Form */}
          <div className="w-full bg-white rounded-2xl p-6 shadow-2xl text-stone-800">
            <div className="flex bg-stone-100 p-1 rounded-xl mb-6">
              <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white shadow-sm text-emerald-700' : 'text-stone-500'}`}>ログイン</button>
              <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-white shadow-sm text-emerald-700' : 'text-stone-500'}`}>新規登録</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">ユーザー名</label>
                  <input type="text" value={authName} onChange={e => setAuthName(e.target.value)} placeholder="例: 田中太郎" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">メールアドレス</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="example@email.com" className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">パスワード</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input type={showPassword ? 'text' : 'password'} value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="6文字以上" className="w-full pl-11 pr-12 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {authError}
                </div>
              )}

              <button type="submit" disabled={authLoading} className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {authLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {authMode === 'register' ? '新規登録' : 'ログイン'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-stone-200"></div>
              <span className="text-xs text-stone-400 font-bold">または</span>
              <div className="flex-1 border-t border-stone-200"></div>
            </div>

            <div className="space-y-3">
              <button onClick={() => signInWithGoogle()} className="w-full py-3 bg-white border-2 border-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Googleでログイン
              </button>
              <button className="w-full py-3 bg-[#06C755] text-white font-bold rounded-xl hover:bg-[#05b04d] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .348-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .349-.281.63-.63.63h-2.386c-.348 0-.63-.281-.63-.63V9.863c0-.349.282-.63.63-.63h2.386zm-3.855 0c.348 0 .63.285.63.631v3.024c0 .349-.282.63-.63.63-.349 0-.63-.281-.63-.63V9.863c0-.349.281-.63.63-.63zm-2.77 0c.349 0 .63.285.63.631 0 .195-.092.376-.24.493l-2.21 2.29h1.82c.349 0 .63.283.63.63 0 .349-.281.63-.63.63H10.36c-.348 0-.63-.281-.63-.63 0-.196.092-.378.24-.494l2.21-2.289h-1.82c-.349 0-.63-.282-.63-.63 0-.348.281-.63.63-.63h2.38zm-5.07 0c.349 0 .63.285.63.631v3.024c0 .349-.281.63-.63.63-.348 0-.63-.281-.63-.63v-2.394H5.715c-.349 0-.63-.282-.63-.63 0-.349.281-.63.63-.63h1.955zM12 1C5.373 1 0 5.373 0 12c0 5.628 3.874 10.35 9.098 11.647.197.053.25-.085.25-.19v-2.22c-3.697.804-4.477-1.587-4.477-1.587-.605-1.536-1.477-1.945-1.477-1.945-1.208-.825.091-.809.091-.809 1.335.094 2.037 1.371 2.037 1.371 1.187 2.034 3.115 1.447 3.874 1.107.12-.86.465-1.447.846-1.78-2.953-.335-6.058-1.477-6.058-6.577 0-1.453.519-2.641 1.371-3.573-.137-.335-.595-1.69.131-3.522 0 0 1.118-.358 3.663 1.364 1.062-.296 2.202-.444 3.335-.449 1.132.005 2.273.153 3.335.449 2.545-1.722 3.661-1.364 3.661-1.364.727 1.832.269 3.187.132 3.522.854.932 1.371 2.12 1.371 3.573 0 5.114-3.11 6.238-6.071 6.568.478.412.903 1.222.903 2.464v3.654c0 .107.052.245.254.189C20.131 22.344 24 17.624 24 12c0-6.627-5.373-12-12-12z" /></svg>
                LINEでログイン
              </button>
            </div>
          </div>

          <p className="text-emerald-200 text-[10px] mt-6 text-center">
            登録することで利用規約とプライバシーポリシーに同意したものとみなされます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-stone-100 font-sans text-stone-800 max-w-md mx-auto shadow-2xl overflow-hidden relative">

      {/* --- POSTWALL IMPLEMENTATION --- */}
      {/* If user hasn't posted in 7 days, they can only see their own content or limited home feed */}
      {/* We apply a blur/lock overlay on the home/community tabs if they try to interact too much */}
      {!hasPosted && activeTab !== 'mypage' && activeTab !== 'record' && showLockModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in touch-none">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-pop-in">
            <div className="bg-emerald-600 p-6 flex flex-col items-center justify-center text-white relative">
              <button
                onClick={() => setShowLockModal(false)}
                className="absolute top-3 right-3 p-1 bg-black/20 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1 text-center">閲覧が制限されています</h3>
              <p className="text-sm text-emerald-100 text-center">
                1週間以上投稿がありません
              </p>
            </div>
            <div className="p-6">
              <p className="text-stone-600 text-sm mb-6 text-center leading-relaxed">
                他の農家さんの知見を見るには、あなたも定期的に情報を記録・共有しましょう。<br />週に1回の投稿で、すべての機能が利用可能になります。
              </p>

              <button
                onClick={() => {
                  setShowLockModal(false);
                  setShowPostMenu(true);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] active:scale-95 transition-transform text-lg mb-3"
              >
                <PenTool className="w-5 h-5 mr-2" />
                今すぐ記録する
              </button>

              <button
                onClick={() => {
                  setShowLockModal(false);
                  setActiveTab('profile');
                }}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center active:scale-95 transition-all"
              >
                自分の記録を見る
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PUBLIC PROFILE MODAL --- */}
      {viewedUser && (
        <PublicProfileView
          user={viewedUser}
          onClose={() => setViewedUser(null)}
        />
      )}

      {/* --- TOP HEADER (sticky) --- */}
      <header className="sticky top-0 bg-emerald-600 text-white p-4 shadow-md z-20 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowSettingsModal(true)} role="button">
          <Sprout className="w-6 h-6" />
          <h1 className="font-bold text-lg tracking-wider">AgriReview</h1>
        </div>
        <div className="flex items-center gap-3">
          {!hasPosted && (
            <div className="text-[10px] bg-emerald-800 px-2 py-1 rounded-full animate-pulse font-bold">
              閲覧制限中
            </div>
          )}
          <button onClick={() => setShowNotificationsModal(true)} className="relative p-1 hover:bg-emerald-700 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-emerald-600 rounded-full"></span>
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="p-1 hover:bg-emerald-700 rounded-full transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto pb-28 scroll-smooth">

        {/* TIMELINE VIEW (Home) */}
        {activeTab === 'home' && !selectedPost && (
          <div className="space-y-4">
            {/* Home Sub Tabs */}
            <div className="px-4 pt-4 sticky top-0 z-10 bg-stone-100">
              <div className="flex bg-white/80 backdrop-blur p-1 rounded-xl shadow-sm border border-stone-100">
                <button onClick={() => setHomeTab('recommended')} className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all ${homeTab === 'recommended' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>おすすめ</button>
                <button onClick={() => setHomeTab('ranking')} className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all ${homeTab === 'ranking' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>ランキング</button>
                <button onClick={() => setHomeTab('trend')} className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all ${homeTab === 'trend' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>トレンド</button>
                <button onClick={() => setHomeTab('news')} className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all ${homeTab === 'news' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>ニュース</button>
              </div>
            </div>

            {homeTab === 'recommended' && (
              <>
                {/* Highlights - フォロー中の写真ストーリー */}
                <div className="px-4 mb-2">
                  <h3 className="font-bold text-stone-700 text-sm mb-3 flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" />ハイライト</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {[{ name: '田中農園', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cfdfeeab?q=80&w=100&auto=format&fit=crop', loc: '千葉県', crop: 'トマト' },
                    { name: '鈴木ファーム', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', loc: '新潟県', crop: '水稲' },
                    { name: '山田農園', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', loc: '長野県', crop: 'レタス' },
                    { name: '佐藤ファーム', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop', loc: '北海道', crop: 'かぼちゃ' },
                    ].map((u, i) => (
                      <button key={i} onClick={() => showComingSoon('ハイライト')} className="flex flex-col items-center min-w-[68px] group">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 mb-1">
                          <img src={u.img} className="w-full h-full rounded-full object-cover border-2 border-white" alt="" />
                        </div>
                        <span className="text-[10px] font-bold text-stone-600 truncate w-full text-center">{u.name}</span>
                      </button>
                    ))}
                    <button onClick={() => showComingSoon('ハイライト')} className="flex flex-col items-center min-w-[68px]">
                      <div className="w-16 h-16 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center mb-1">
                        <Plus className="w-6 h-6 text-stone-400" />
                      </div>
                      <span className="text-[10px] font-bold text-stone-400">もっと見る</span>
                    </button>
                  </div>
                </div>
                {/* 今日のおすすめ (Horizontal Scroll) */}
                <div className="bg-white p-4 pb-6 shadow-sm border-b border-stone-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="font-bold text-stone-700">おすすめの資材・農法</h2>
                  </div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {RECOMMENDED_ITEMS.map(item => (
                      <div key={item.id} className="min-w-[160px] bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-100 flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full mb-2 inline-block shadow-sm">{item.type}</span>
                        <h3 className="font-bold text-sm text-stone-800 mb-1 leading-tight">{item.name}</h3>
                        <p className="text-[10px] text-stone-500 line-clamp-2">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended farmers */}
                {/* おすすめの農家さん */}
                <div className="px-4">
                  <h3 className="font-bold text-stone-700 text-sm mb-3">おすすめの農家さん</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {[{ name: '田中農園', img: '1535713875002-d1d0cfdfeeab', loc: '千葉県', crop: 'トマト', cert: true },
                    { name: '鈴木ファーム', img: '1544005313-94ddf0286df2', loc: '新潟県', crop: '水稲', cert: false },
                    { name: '山田農園', img: '1500648767791-00dcc994a43e', loc: '長野県', crop: 'レタス', cert: false },
                    ].map((farmer, i) => (
                      <button key={i} onClick={() => setViewedUser({ name: farmer.name, avatarUrl: `https://images.unsplash.com/photo-${farmer.img}?q=80&w=100&auto=format&fit=crop`, isCertified: farmer.cert, selfPromo: farmer.crop + 'を中心に栽培', location: farmer.loc, crops: [farmer.crop], experience: '専業', posts: posts.filter(p => p.author?.name === farmer.name).length > 0 ? posts.filter(p => p.author?.name === farmer.name).length : 2, followersCount: 80 + i * 40, followingCount: 15 + i * 10 })} className="flex flex-col items-center min-w-[70px] bg-white p-3 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow active:scale-95">
                        <img src={`https://images.unsplash.com/photo-${farmer.img}?q=80&w=60&auto=format&fit=crop`} className="w-12 h-12 rounded-full object-cover mb-1" alt="" />
                        <span className="text-[10px] font-bold text-stone-700 truncate w-full text-center">{farmer.name}</span>
                        <span className="text-[9px] text-stone-400">{farmer.loc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-4 space-y-4 pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <h2 className="font-bold text-stone-700">おすすめの投稿</h2>
                  </div>
                  {/* mix of posts */}
                  {posts.slice(0, 5).map((post) => renderPostCard(post))}
                </div>
              </>
            )}

            {homeTab === 'ranking' && (
              <div className="px-4 space-y-3">
                {[...posts].sort((a, b) => b.likes - a.likes).map((post, i) => renderPostCard(post, i, true))}
              </div>
            )}

            {homeTab === 'trend' && (
              <div className="px-4 space-y-4">
                <div className="flex gap-2">
                  {([['day', '1日'], ['week', '1週間'], ['month', '1ヶ月']] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setTrendRange(key)} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${trendRange === key ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-stone-600 border border-stone-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-stone-700 text-sm">トレンドのハッシュタグ</h3>
                  {['#トマト栽培', '#新規就農', '#減農薬', '#スマート農業', '#収穫祭り'].map((tag, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-stone-300">{i + 1}</span>
                        <div>
                          <span className="font-bold text-emerald-700 text-sm">{tag}</span>
                          <p className="text-[10px] text-stone-400">{Math.floor(Math.random() * 100 + 20)}件の投稿</p>
                        </div>
                      </div>
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-stone-700 text-sm">人気の投稿</h3>
                  {[...posts].sort((a, b) => b.likes - a.likes).slice(0, 3).map((post, i) => renderPostCard(post, i, true))}
                </div>
              </div>
            )}

            {homeTab === 'news' && (
              <div className="p-4 space-y-4 min-h-[50vh]">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h2 className="font-bold text-stone-700">農業ニュース・お知らせ</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition-shadow relative">
                    <span className="absolute top-4 right-4 text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-sm">重要</span>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">資材情報</span>
                      <span className="text-xs text-stone-400 mr-10">2026/02/23</span>
                    </div>
                    <p className="text-sm font-bold text-stone-800 mt-2">2026年春の新資材特集が公開されました！</p>
                    <p className="text-xs text-stone-500 mt-1">最新の肥料や防除技術、今季注目の種苗リストをチェックしましょう。</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">イベント</span>
                      <span className="text-xs text-stone-400">2026/02/20</span>
                    </div>
                    <p className="text-sm font-bold text-stone-800 mt-2">週末のオンライン就農支援相談会</p>
                    <p className="text-xs text-stone-500 mt-1">先輩農家さんから直接話が聞けるチャンスです。参加費無料。</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEARCH VIEW */}
        {activeTab === 'search' && !selectedPost && (
          <div className="p-4 space-y-4 pb-32">
            {/* Search Input & Sort/Filter Config */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchInput.trim()) {
                      const q = searchInput.toLowerCase();
                      const results = posts.filter(p =>
                        p.content?.toLowerCase().includes(q) ||
                        p.material?.toLowerCase().includes(q) ||
                        p.author?.name?.toLowerCase().includes(q) ||
                        p.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
                        p.category?.toLowerCase().includes(q) ||
                        p.type?.toLowerCase().includes(q)
                      );
                      setSearchResults(results);
                      setHasSearched(true);
                    }
                  }}
                  placeholder="投稿・資材・農家を検索..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm shadow-sm"
                />
              </div>

              {/* Sort & Filter Configurations */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <select value={searchFilter} onChange={e => {
                  setSearchFilter(e.target.value);
                  if (hasSearched) {
                    const q = searchInput.toLowerCase();
                    const results = posts.filter(p =>
                      p.content?.toLowerCase().includes(q) ||
                      p.material?.toLowerCase().includes(q) ||
                      p.author?.name?.toLowerCase().includes(q) ||
                      p.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
                      p.category?.toLowerCase().includes(q) ||
                      p.type?.toLowerCase().includes(q)
                    );
                    setSearchResults(results);
                  }
                }} className="bg-white border border-stone-200 text-xs font-bold rounded-lg px-3 py-2 text-stone-600 outline-none flex-1 min-w-[100px]">
                  <option value="all">全て</option>
                  <option value="review">レビュー</option>
                  <option value="photo">写真</option>
                  <option value="blog">ブログ</option>
                  <option value="diary">日誌</option>
                  <option value="purchase">購入</option>
                </select>
                <select value={searchSort} onChange={e => setSearchSort(e.target.value)} className="bg-white border border-stone-200 text-xs font-bold rounded-lg px-3 py-2 text-stone-600 outline-none flex-1 min-w-[100px]">
                  <option value="newest">新しい順</option>
                  <option value="oldest">古い順</option>
                  <option value="likes">いいね順</option>
                </select>
                {hasSearched && (
                  <span className="text-xs text-stone-400 font-bold self-center ml-auto whitespace-nowrap bg-stone-100 px-2 py-1 rounded">
                    {(() => {
                      let r = searchResults;
                      if (searchFilter !== 'all') r = r.filter(p => p.type === searchFilter);
                      return r.length;
                    })()}件
                  </span>
                )}
              </div>
            </div>

            {/* Results */}
            {hasSearched ? (
              <div className="space-y-3">
                {(() => {
                  let r = searchResults;
                  if (searchFilter !== 'all') r = r.filter(p => p.type === searchFilter);
                  if (searchSort === 'likes') r = [...r].sort((a, b) => b.likes - a.likes);
                  if (searchSort === 'oldest') r = [...r].reverse();
                  return r.length > 0 ? r.map(post => renderPostCard(post)) : (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 font-bold">「{searchInput}」の検索結果はありません</p>
                      <p className="text-stone-400 text-xs mt-1">別のキーワードで検索してみましょう</p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-12 h-12 text-stone-200 mb-4" />
                <p className="text-stone-500 font-bold mb-1">何をお探しですか？</p>
                <p className="text-stone-400 text-xs">キーワードを入力して、投稿や資材、<br />農家さんを見つけましょう。</p>
              </div>
            )}
          </div>
        )}

        {/* COMMUNITY VIEW */}
        {activeTab === 'community' && !selectedPost && (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-white border-b border-stone-100 sticky top-0 z-10 pb-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-stone-800">コミュニティ</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCommunityTab('manage')} className={`text-sm font-bold flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${communityTab === 'manage' ? 'bg-stone-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    <Users className="w-4 h-4" />
                    管理
                  </button>
                  <button onClick={() => setShowCreateCommunity(true)} className="text-emerald-600 text-sm font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                    <Plus className="w-4 h-4" />
                    作成する
                  </button>
                </div>
              </div>

              {/* Community Sub Tabs (Scrollable) */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pt-1">
                <button
                  onClick={() => setCommunityTab('following')}
                  className={`whitespace-nowrap pb-3 text-sm font-bold text-center border-b-2 transition-all ${communityTab === 'following' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                >
                  フォロー中
                </button>
                {COMMUNITIES.map(comm => (
                  <button
                    key={comm.id}
                    onClick={() => setCommunityTab(`comm_${comm.id}`)}
                    className={`whitespace-nowrap pb-3 text-sm font-bold text-center border-b-2 transition-all flex items-center gap-1 ${communityTab === `comm_${comm.id}` ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                  >
                    <span>{comm.active ? '🔥' : '🌱'}</span> {comm.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {communityTab !== 'manage' ? (
                /* Timeline View for Followings or Specific Community */
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-500 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {communityTab === 'following' ? 'フォロー中の最新投稿' : 'このコミュニティの最新投稿'}
                  </h3>
                  {posts.filter(p => true).slice(0, 5).map((post) => (
                    <div key={`comm-post-${post.id}`} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick(post)}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <img src={post.author.avatarUrl} alt={post.author.name} className="w-8 h-8 rounded-full border border-stone-100 object-cover" />
                          <div>
                            <p className="text-xs font-bold text-stone-800 flex items-center gap-1">
                              {post.author.name}
                              {renderUserBadge(post.author.isCertified, post.likes)}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5">
                              <span className="bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded-sm">{post.tags?.[0] || 'コミュニティ'}</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-stone-700 mb-2 leading-relaxed">{post.content}</p>
                      {post.image && (
                        <img src={post.image} className="w-full h-32 object-cover rounded-lg mb-2" alt="Community Post" />
                      )}
                      <div className="flex items-center gap-4 text-xs font-medium text-stone-400 mt-3 pt-3 border-t border-stone-50">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.comments}</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center py-4 text-sm text-stone-400">
                    これ以上投稿はありません
                  </div>
                </div>
              ) : (
                /* Manage View for Communities */
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-500">参加中のコミュニティ</h3>
                  <div className="space-y-3">
                    {COMMUNITIES.map(comm => (
                      <div key={comm.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between cursor-pointer active:scale-95 transition-transform hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-xl shadow-inner">
                            {comm.active ? '🔥' : '🌱'}
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-800 text-sm">{comm.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {comm.members}人</span>
                              {comm.active && <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded">活発</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-300" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-stone-50 p-6 rounded-2xl border border-dashed border-stone-300 text-center">
                    <Hash className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-stone-600 mb-1">新しい場所を作ろう</p>
                    <p className="text-xs text-stone-400">共通の作物や課題について話し合うコミュニティを誰でも作成できます。</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEARCH VIEW */}
        {activeTab === 'search' && !selectedPost && (
          <div className="p-4 space-y-4 flex flex-col h-full">
            <h2 className="font-bold text-stone-700 text-lg">探す</h2>

            {/* Split Search Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setSearchTab('materials')}
                className={`flex-1 py-2 text-sm font-bold text-center rounded-lg transition-all ${searchTab === 'materials' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                農業資材で検索
              </button>
              <button
                onClick={() => setSearchTab('farmers')}
                className={`flex-1 py-2 text-sm font-bold text-center rounded-lg transition-all ${searchTab === 'farmers' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                農家で検索
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder={searchTab === 'materials' ? "資材名・病害虫などをフリー入力..." : "農家名、キーワード..."}
                className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-white shadow-sm border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium"
              />
              <button className="absolute right-2 top-2 p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Composite Filters */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-700">複合条件で絞り込む</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-stone-500 font-bold">作物</span>
                  <input type="text" placeholder="例: トマト" className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-stone-500 font-bold">地域</span>
                  <input type="text" placeholder="例: 北海道" className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" />
                </div>
                {searchTab === 'materials' && (
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <span className="text-xs text-stone-500 font-bold">使った時期</span>
                    <input type="text" placeholder="例: 春、定植期" className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" />
                  </div>
                )}
              </div>

              <button className="w-full mt-2 py-3 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                この条件で検索する
              </button>
            </div>

            {/* Search Results Placeholder */}
            <div>
              <p className="text-xs text-stone-400 mb-2">おすすめの検索結果</p>
              {posts.filter(p => p.type === 'review').slice(0, 2).map((post) => (
                <div
                  key={`search-${post.id}`}
                  onClick={() => handlePostClick(post)}
                  className="bg-white p-3 rounded-xl shadow-sm mb-3 flex gap-3 items-center active:scale-95 transition-transform"
                >
                  <img src={post.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-stone-800">{post.material}</h4>
                    <p className="text-xs text-stone-500 mb-1">{post.author.name}</p>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{post.rating}.0</span>
                      <span className="bg-stone-100 px-1 rounded truncate max-w-[100px] ml-1">{post.attribute}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POST FORM VIEW (Record) */}
        {activeTab === 'record' && (
          <div className="p-4 pb-32 h-full flex flex-col overflow-y-auto">
            {isSubmitting ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                <p className="text-emerald-700 font-bold">送信中...</p>
              </div>
            ) : showConfetti ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-bounce-in">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-6xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-emerald-800 mb-2">記録完了！</h2>
                <p className="text-stone-500 mb-8">コミュニティへの貢献ありがとうございます。<br />全てのレビューが見れるようになりました。</p>
                <Confetti />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="text-center mb-2">
                  <h2 className="font-bold text-xl text-stone-700 flex items-center justify-center gap-2">
                    {(() => {
                      const info = getPostTypeInfo(postMode);
                      const Icon = info.icon;
                      return <Icon className={`w-6 h-6 ${info.color}`} />;
                    })()}
                    {getPostTypeInfo(postMode).label}を記録
                  </h2>
                </div>

                {/* 1. Photo (Big Tap Target) */}
                <div className="relative">
                  <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                  <label htmlFor="photo-upload"
                    className={`block w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                      ${photoPreview ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}
`}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                    ) : (
                      <>
                        <Camera className="w-10 h-10 text-stone-400 mb-2" />
                        <span className="text-sm text-stone-500 font-medium">写真を撮る・選ぶ</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Mode Specific Fields */}

                {/* Review Mode */}
                {postMode === 'review' && (
                  <div className="space-y-6 animate-pop-in">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">1. 資材の種類</label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-sm bg-white appearance-none font-bold text-stone-700"
                        >
                          {['農薬', '肥料', '種苗', 'その他'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronRight className="w-5 h-5 text-stone-400 absolute right-3 top-3.5 pointer-events-none transform rotate-90" />
                      </div>
                    </div>

                    {/* Usage Period and Temperature */}
                    <div className="flex gap-4 animate-pop-in">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">使用時期（任意）</label>
                        <input type="date" value={reviewTiming} onChange={(e) => setReviewTiming(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-sm bg-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">気温（任意）</label>
                        <input type="text" value={reviewTemp} onChange={(e) => setReviewTemp(e.target.value)} placeholder="例: 25℃前後" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-sm" />
                      </div>
                    </div>

                    {/* Target/Situation Selection */}
                    <div className="animate-pop-in">
                      <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">2. 使う状況・目的（対象）</label>
                      <div className="relative mb-3">
                        <input
                          type="text"
                          value={selectedTarget}
                          onChange={(e) => setSelectedTarget(e.target.value)}
                          placeholder="対象病害虫・作物などをフリー入力"
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-sm"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TARGET_TAGS[selectedCategory].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTarget(tag === selectedTarget ? '' : tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedTarget === tag ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Search Bar with Mic & Suggestions */}
                    {!reviewMaterial ? (
                      <div className="animate-pop-in">
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">3. キーワード・音声検索</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`${selectedCategory}の名前を入力...`}
                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsListening(true);
                              // 擬似的な音声認識（2秒後にキーワードが入る）
                              setTimeout(() => {
                                setSearchQuery(selectedCategory === '農薬' ? 'アファーム' : 'マイガーデン');
                                setIsListening(false);
                              }, 2000);
                            }}
                            className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-stone-100 text-stone-400'}`}
                          >
                            <Mic className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Suggestions */}
                        {(searchQuery || selectedTarget) && (
                          <div className="mt-2 bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden max-h-48 overflow-y-auto">
                            {suggestedMaterials.length > 0 ? (
                              suggestedMaterials.map((item, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setReviewMaterial(item.name)}
                                  className="px-4 py-3 border-b border-stone-100 last:border-0 hover:bg-emerald-50 cursor-pointer flex items-center justify-between transition-colors"
                                >
                                  <span className="font-bold text-stone-700 text-sm">{item.name}</span>
                                  <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{item.target}</span>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-4 text-sm text-stone-500 text-center bg-stone-50">
                                候補が見つかりません。
                                {/* Create Community Input - Only for Certified Users */}
                                {currentUser.isCertified && (
                                  <div className="bg-white p-3 mb-2 flex items-center space-x-2 border-b border-stone-200">
                                    <img src={currentUser.avatarUrl} alt="Your avatar" className="w-8 h-8 rounded-full" />
                                    <div
                                      className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-sm text-stone-500 flex items-center cursor-text"
                                      onClick={() => {
                                        setPostMode('post');
                                        setActiveTab('add');
                                      }}
                                    >
                                      <PenTool className="w-4 h-4 mr-2" />
                                      新しいコミュニティを作成...
                                    </div>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setMaterialName(searchQuery || '新規資材')}
                                  className="block w-full mt-2 text-emerald-600 font-bold underline"
                                >
                                  「{searchQuery}」を直接登録する
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="animate-pop-in">
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">3. 選択された資材</label>
                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="font-bold text-emerald-800">{materialName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMaterialName('')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 4. Rating (Big Stars) */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <label className="block text-center text-xs font-bold text-stone-500 mb-3 uppercase tracking-wide">4. 評価（効果や満足度）</label>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-10 h-10 transition-colors ${reviewRating >= star ? 'text-yellow-400 fill-current' : 'text-stone-300'} hover:text-yellow-300 cursor-pointer`}
                            onClick={() => setReviewRating(star)}
                          />
                        ))}
                      </div>
                      <div className="text-center mt-2 text-sm font-bold text-stone-600">
                        {reviewRating === 0 ? 'タップして評価' :
                          reviewRating === 1 ? '不満' :
                            reviewRating === 2 ? 'いまいち' :
                              reviewRating === 3 ? '普通' :
                                reviewRating === 4 ? '良い' : 'とても良い'}
                        {reviewRating === 0 && <p className="text-center text-xs text-red-400 mt-2">※必須項目です</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Blog / Album Mode */}
                {(postMode === 'blog' || postMode === 'album') && (
                  <div className="animate-pop-in">
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">タイトル</label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder={postMode === 'blog' ? "例: 秋の土づくりで気をつけていること" : "例: 2023年 トマト栽培記録"}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                      required
                    />
                  </div>
                )}

                {/* Purchase Mode */}
                {postMode === 'purchase' && (
                  <div className="flex gap-4 animate-pop-in">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">購入資材名</label>
                      <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="例: 〇〇肥料 20kg" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" required />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">購入金額</label>
                      <input type="text" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} placeholder="例: 3,000円" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" required />
                    </div>
                  </div>
                )}

                {/* Diary Mode */}
                {postMode === 'diary' && (
                  <div className="flex gap-4 animate-pop-in">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">作業項目</label>
                      <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="例: 定植、追肥、草刈り" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" required />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">作業時間</label>
                      <input type="text" value={workTime} onChange={(e) => setWorkTime(e.target.value)} placeholder="例: 3時間" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" required />
                    </div>
                  </div>
                )}

                {/* Photo Caption (for photo mode) */}
                {postMode === 'photo' && photoPreview && (
                  <div className="animate-pop-in">
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">キャプション</label>
                    <input
                      type="text"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="写真にキャプションを添えましょう..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm shadow-sm"
                    />
                  </div>
                )}

                {/* Free Text (Placeholder changes by mode) */}
                {postMode !== 'photo' && (
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide">
                        {postMode === 'review' ? 'レビュー・メモ' : '投稿内容'}
                      </label>
                      <button type="button" className="text-emerald-600 flex items-center gap-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors leading-none">
                        <Mic className="w-3 h-3" /> 音声入力
                      </button>
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      required={postMode !== 'photo' && postMode !== 'album'}
                      placeholder={postMode === 'review' ? "【書き方の例】\n・対象：アブラムシ\n・結果：散布翌日には全滅。\n・注意点：匂いが少しキツイ。" : "詳細や気づいたことなどを自由に書いてみましょう。"}
                      className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm leading-relaxed shadow-sm resize-none"
                    ></textarea>
                  </div>
                )}

                {/* Visibility Settings */}
                <div className="pt-2 animate-pop-in">
                  <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">公開範囲</label>
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                    <button
                      type="button"
                      onClick={() => setPostVisibility('public')}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${postVisibility === 'public' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'}`}
                    >
                      <Globe className="w-3.5 h-3.5" /> 全体公開
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostVisibility('community')}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${postVisibility === 'community' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'}`}
                    >
                      <Users className="w-3.5 h-3.5" /> 所属コミュニティ
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostVisibility('followers')}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${postVisibility === 'followers' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'}`}
                    >
                      <User className="w-3.5 h-3.5" /> フォロワーのみ
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostVisibility('draft')}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${postVisibility === 'draft' ? 'border-stone-600 bg-stone-100 text-stone-700' : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'}`}
                    >
                      <FileText className="w-3.5 h-3.5" /> 下書きとして保存
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={(() => {
                    if (postMode === 'review') return reviewRating === 0 || !materialName || !reviewText;
                    if (postMode === 'blog' || postMode === 'album') return !postTitle;
                    if (postMode === 'purchase') return !materialName || !purchaseAmount;
                    if (postMode === 'diary') return !materialName || !workTime;
                    return !reviewText && !photoPreview;
                  })()}
                  className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform bg-emerald-600 text-white hover:bg-emerald-700 active:translate-y-1 shadow-emerald-200 disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {postVisibility === 'draft' ? '下書きに保存' : '記録して共有'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'profile' && !selectedPost && (
          <div className="bg-stone-50 min-h-full">
            {/* Profile Header (Sticky-ish) */}
            <div className="bg-white px-6 pt-8 pb-4 shadow-sm border-b border-stone-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-600 to-teal-700"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3 overflow-hidden relative">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  {/* Rank Badge Indicator on Avatar */}
                  <div className={`absolute bottom-0 w-full py-0.5 text-[10px] font-bold text-center text-white ${myRank.name === 'ゴールド' ? 'bg-yellow-500' : myRank.name === 'シルバー' ? 'bg-stone-400' : 'bg-amber-700'}`}>
                    {myRank.name}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-stone-800">{currentUser.name}</h2>
                  {isCertifiedSaved && <BadgeCheck className="w-6 h-6 text-emerald-500 fill-emerald-100" />}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">{currentUser.attribute || (currentUser as any).attribute || "未設定"}</span>
                  <span className="text-sm font-bold text-stone-600 flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-emerald-500" /> {myTotalLikes} 獲得
                  </span>
                </div>
                {/* This line was removed as per the instruction: <div className="text-center"><span className="font-bold text-stone-800 block">12</span>友達</div> */}
                {/* This div was also removed as per the instruction: </div> */}

                {/* Rank Info Bar */}
                <div className={`w-full max-w-xs flex items-center justify-between px-4 py-2 rounded-xl border ${myRank.bgColor} ${myRank.borderColor}`}>
                  <div className="flex items-center gap-2">
                    <Award className={`w - 5 h - 5 ${myRank.iconColor} `} />
                    <span className={`text - sm font - bold ${myRank.iconColor} `}>現在のランク</span>
                  </div>
                  <span className={`font - black ${myRank.iconColor} `}>{myRank.name}</span>
                </div>
              </div>
            </div>

            {/* Profile Sub Tabs */}
            <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm border-b border-stone-100">
              <div className="flex bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveProfileTab('posts')}
                  className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all ${activeProfileTab === 'posts' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  記録
                </button>
                <button
                  onClick={() => setActiveProfileTab('drafts')}
                  className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all ${activeProfileTab === 'drafts' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  下書き
                </button>
                <button
                  onClick={() => setActiveProfileTab('friends')}
                  className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all ${activeProfileTab === 'friends' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  友達
                </button>
                <button
                  onClick={() => setActiveProfileTab('settings')}
                  className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all ${activeProfileTab === 'settings' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  設定
                </button>
              </div>
            </div>

            {/* Sub Tab Contents */}
            <div className="p-4">

              {/* Posts Tab */}
              {activeProfileTab === 'posts' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4 bg-white p-2 text-stone-700 rounded-xl shadow-sm border border-stone-100">
                    <Filter className="w-5 h-5 text-stone-400 ml-2" />
                    <select value={profilePostFilter} onChange={e => setProfilePostFilter(e.target.value)} className="bg-stone-50 border-none text-xs font-bold text-stone-700 outline-none rounded-lg px-2 py-1">
                      <option value="all">すべて</option>
                      <option value="photo">写真</option>
                      <option value="album">アルバム</option>
                      <option value="review">レビュー</option>
                      <option value="blog">ブログ</option>
                      <option value="purchase">購入</option>
                    </select>
                    <div className="flex-1"></div>
                    <select value={profilePostSort} onChange={e => setProfilePostSort(e.target.value)} className="bg-stone-50 border-none text-xs font-bold text-stone-700 outline-none rounded-lg px-2 py-1 mr-2">
                      <option value="newest">新しい順</option>
                      <option value="likes">いいね順</option>
                    </select>
                  </div>

                  {(() => {
                    let filteredMyPosts = [...myPosts];
                    if (profilePostFilter !== 'all') {
                      filteredMyPosts = filteredMyPosts.filter(p => p.type === profilePostFilter);
                    }
                    if (profilePostSort === 'likes') {
                      filteredMyPosts.sort((a, b) => b.likes - a.likes);
                    } else {
                      filteredMyPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    }

                    if (filteredMyPosts.length === 0) {
                      return (
                        <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-stone-300">
                          <p className="text-stone-500 text-sm mb-4">まだ投稿がありません。</p>
                          <button onClick={() => setActiveTab('record')} className="text-emerald-600 font-bold text-sm underline">
                            最初の投稿をする
                          </button>
                        </div>
                      );
                    }
                    return filteredMyPosts.map((post: any) => renderPostCard(post));
                  })()}
                </div>
              )}

              {/* Drafts Tab */}
              {activeProfileTab === 'drafts' && (
                <div className="space-y-3">
                  {drafts.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-stone-300">
                      <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 text-sm mb-4">保存された下書きはありません。</p>
                    </div>
                  ) : (
                    drafts.map((post: any) => renderPostCard(post))
                  )}
                </div>
              )}

              {/* Friends Tab */}
              {activeProfileTab === 'friends' && (
                <div className="space-y-4">
                  {!friendSubView && (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-4 border-b border-stone-200 pb-4">
                        <button onClick={() => setFriendSubView('followings')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95">
                          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center"><UserPlus className="w-5 h-5 text-emerald-500" /></div>
                          <span className="font-bold text-xs text-stone-700">フォロー中 (3)</span>
                        </button>
                        <button onClick={() => setFriendSubView('followers')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95">
                          <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-teal-500" /></div>
                          <span className="font-bold text-xs text-stone-700">フォロワー (0)</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setFriendSubView('likes')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95">
                          <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center"><Heart className="w-5 h-5 text-pink-500" /></div>
                          <span className="font-bold text-xs text-stone-700">いいね一覧</span>
                        </button>
                        <button onClick={() => setFriendSubView('comments')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5 text-blue-500" /></div>
                          <span className="font-bold text-xs text-stone-700">コメント管理</span>
                        </button>
                        <button onClick={() => setFriendSubView('messages')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95 relative">
                          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center relative">
                            <MessageSquare className="w-5 h-5 text-indigo-500" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">2</span>
                          </div>
                          <span className="font-bold text-xs text-stone-700">メッセージ</span>
                        </button>
                        <button onClick={() => setFriendSubView('follows')} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95 relative">
                          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center relative">
                            <UserPlus className="w-5 h-5 text-stone-500" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">{followRequests.filter(f => f.status === 'pending').length}</span>
                          </div>
                          <span className="font-bold text-xs text-stone-700">フォロー申請</span>
                        </button>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center mt-4">
                        <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm text-emerald-800 font-bold mb-1">友達をアプリに招待する</p>
                        <button className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm w-full shadow-sm">招待リンクをコピー</button>
                      </div>
                    </>
                  )}

                  {/* Followings Sub-View */}
                  {friendSubView === 'followings' && (
                    <div className="space-y-3">
                      <button onClick={() => setFriendSubView(null)} className="flex items-center gap-1 text-emerald-600 font-bold text-sm mb-3"><ArrowLeft className="w-4 h-4" />戻る</button>
                      <h3 className="font-bold text-stone-700 text-sm mb-2 px-1 flex items-center gap-1">
                        フォロー中一覧
                      </h3>
                      {MOCK_FRIENDS.map((friend, i) => (
                        <button key={i} onClick={() => setViewedUser({
                          name: friend.name,
                          avatarUrl: `https://images.unsplash.com/photo-${friend.avatarId}?q=80&w=100&auto=format&fit=crop`,
                          isCertified: i === 0,
                          selfPromo: '農業が好きです',
                          location: friend.location,
                          crops: [friend.mainCrop],
                          experience: friend.exp,
                          posts: 3,
                          followersCount: 120,
                          followingCount: 34
                        })} className="w-full bg-white p-3 rounded-xl shadow-sm border border-stone-100 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
                          <img src={`https://images.unsplash.com/photo-${friend.avatarId}?q=80&w=60&auto=format&fit=crop`} className="w-12 h-12 rounded-full object-cover" alt="" />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-stone-800">{friend.name}</p>
                            <p className="text-[10px] text-stone-500">{friend.desc}</p>
                          </div>
                          <button className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-stone-200" onClick={e => { e.stopPropagation(); showComingSoon('フォロー解除'); }}>
                            フォロー中
                          </button>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Followers Sub-View */}
                  {friendSubView === 'followers' && (
                    <div className="space-y-3">
                      <button onClick={() => setFriendSubView(null)} className="flex items-center gap-1 text-emerald-600 font-bold text-sm mb-3"><ArrowLeft className="w-4 h-4" />戻る</button>
                      <h3 className="font-bold text-stone-700 text-sm mb-2 px-1 flex items-center gap-1">
                        フォロワー一覧
                      </h3>
                      <div className="bg-white p-6 rounded-xl border border-stone-100 text-center">
                        <Users className="w-10 h-10 text-stone-200 mx-auto mb-2" />
                        <p className="text-stone-400 text-xs font-bold leading-relaxed">
                          役立つ投稿をして<br />
                          フォロワーを増やしましょう！
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Messages Sub-View */}
                  {friendSubView === 'messages' && !selectedChat && (
                    <div>
                      <button onClick={() => setFriendSubView(null)} className="flex items-center gap-1 text-emerald-600 font-bold text-sm mb-3"><ArrowLeft className="w-4 h-4" />戻る</button>
                      <h3 className="font-bold text-stone-800 mb-3">メッセージ</h3>
                      <div className="space-y-2">
                        {mockMessages.map((msg: any) => (
                          <button key={msg.id} onClick={() => setSelectedChat(msg)} className="w-full bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
                            <img src={msg.user.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm text-stone-800">{msg.user.name}</span>
                                <span className="text-[10px] text-stone-400">{msg.time}</span>
                              </div>
                              <p className="text-xs text-stone-500 truncate">{msg.lastMessage}</p>
                            </div>
                            {msg.unread > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{msg.unread}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chat View */}
                  {friendSubView === 'messages' && selectedChat && (
                    <div className="flex flex-col" style={{ minHeight: '50vh' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => setSelectedChat(null)} className="p-1"><ArrowLeft className="w-5 h-5 text-stone-600" /></button>
                        <img src={selectedChat.user.avatarUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <span className="font-bold text-stone-800">{selectedChat.user.name}</span>
                      </div>
                      <div className="flex-1 space-y-3 mb-4">
                        {selectedChat.messages.map((m: any, i: number) => (
                          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.from === 'me' ? 'bg-emerald-500 text-white rounded-br-md' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-md'}`}>
                              <p>{m.text}</p>
                              <span className={`text-[10px] mt-1 block ${m.from === 'me' ? 'text-emerald-100' : 'text-stone-400'}`}>{m.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 sticky bottom-0 bg-stone-100 pt-2">
                        <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} placeholder="メッセージを入力..." className="flex-1 px-4 py-3 rounded-full border border-stone-200 bg-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        <button className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm"><Send className="w-5 h-5" /></button>
                      </div>
                    </div>
                  )}

                  {/* Follow Requests Sub-View */}
                  {friendSubView === 'follows' && (
                    <div>
                      <button onClick={() => setFriendSubView(null)} className="flex items-center gap-1 text-emerald-600 font-bold text-sm mb-3"><ArrowLeft className="w-4 h-4" />戻る</button>
                      <h3 className="font-bold text-stone-800 mb-3">フォロー申請</h3>
                      <div className="space-y-3">
                        {followRequests.map((req: any) => (
                          <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                            <div className="flex items-center gap-3 mb-3">
                              <img src={req.user.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-stone-800">{req.user.name}</p>
                                <p className="text-[10px] text-stone-500">{req.user.attribute} ・ {req.user.location}</p>
                              </div>
                            </div>
                            {req.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button onClick={() => setFollowRequests(followRequests.map(f => f.id === req.id ? { ...f, status: 'approved' } : f))} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-sm">承認する</button>
                                <button onClick={() => setFollowRequests(followRequests.filter(f => f.id !== req.id))} className="flex-1 py-2.5 bg-stone-200 text-stone-700 rounded-lg font-bold text-sm">削除</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm"><CheckCircle2 className="w-4 h-4" />承認済み</div>
                            )}
                          </div>
                        ))}
                        {followRequests.length === 0 && <p className="text-center text-stone-400 text-sm py-4">フォロー申請はありません</p>}
                      </div>
                    </div>
                  )}

                  {/* Likes Sub-View */}
                  {friendSubView === 'likes' && (
                    <div>
                      <button onClick={() => setFriendSubView(null)} className="flex items-center gap-1 text-emerald-600 font-bold text-sm mb-3"><ArrowLeft className="w-4 h-4" />戻る</button>
                      <h3 className="font-bold text-stone-800 mb-3">いいねした投稿</h3>
                      <div className="space-y-3">
                        {posts.filter(p => p.likes > 10).slice(0, 5).map(post => renderPostCard(post))}
                      </div>
                    </div>
                  )}

                  {/* Comments Sub-View */}
                  {friendSubView === 'comments' && (
                    <div>
                      <button onClick={() => setFriendSubView(null)} className="flex items-center gap-1 text-emerald-600 font-bold text-sm mb-3"><ArrowLeft className="w-4 h-4" />戻る</button>
                      <h3 className="font-bold text-stone-800 mb-3">コメント管理</h3>
                      <div className="space-y-3">
                        {posts.filter(p => p.comments > 0).slice(0, 5).map(post => renderPostCard(post))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeProfileTab === 'settings' && (
                <div className="space-y-6">
                  {/* Crop Registration */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sprout className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-stone-700">栽培作物・品種の登録</h3>
                    </div>
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed bg-stone-50 p-3 rounded-lg">
                      あなたが栽培している作物や品種を登録しましょう。一度登録すると<strong>1ヶ月間</strong>は変更できません。
                    </p>
                    {(() => {
                      const isLocked = cropLastUpdated && (new Date().getTime() - new Date(cropLastUpdated).getTime()) < 30 * 24 * 60 * 60 * 1000;
                      const daysLeft = cropLastUpdated ? Math.max(0, 30 - Math.floor((new Date().getTime() - new Date(cropLastUpdated).getTime()) / (24 * 60 * 60 * 1000))) : 0;
                      return (
                        <>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {myCrops.map((crop, i) => (
                              <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-100">
                                {crop}
                                {!isLocked && (
                                  <button onClick={() => setMyCrops(myCrops.filter((_, idx) => idx !== i))} className="text-emerald-400 hover:text-red-500 ml-1">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                          {isLocked ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                              <Lock className="w-4 h-4" />
                              次の変更まであと{daysLeft}日です
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newCropInput}
                                onChange={(e) => setNewCropInput(e.target.value)}
                                placeholder="例： トマト 桃太郎"
                                className="flex-1 px-3 py-2.5 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                              />
                              <button
                                onClick={() => {
                                  if (newCropInput.trim()) {
                                    setMyCrops([...myCrops, newCropInput.trim()]);
                                    setNewCropInput('');
                                  }
                                }}
                                disabled={!newCropInput.trim()}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${newCropInput.trim() ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-200 text-stone-400'}`}
                              >
                                追加
                              </button>
                            </div>
                          )}
                          {!isLocked && myCrops.length > 0 && (
                            <button
                              onClick={() => setCropLastUpdated(new Date().toISOString())}
                              className="mt-3 w-full py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-emerald-700 transition-colors"
                            >
                              この内容で確定する
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Certification Application */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex items-center gap-2 mb-3">
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-stone-700">認定農業者バッジ申請</h3>
                    </div>
                    <p className="text-xs text-stone-500 mb-4 leading-relaxed bg-stone-50 p-3 rounded-lg">
                      認定農業者番号を入力して申請してください。運営による確認後、プロフィールに「✅認証バッジ」が付与されます。
                    </p>
                    {certificationStatus === 'approved' ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        <BadgeCheck className="w-5 h-5" />
                        認証済み — バッジが有効です
                      </div>
                    ) : certificationStatus === 'pending' ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertCircle className="w-5 h-5" />
                        審査中です。確認には数日かかる場合があります。
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={certifiedNumber}
                          onChange={(e) => setCertifiedNumber(e.target.value)}
                          placeholder="例: 12345678"
                          className="flex-1 px-3 py-2.5 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        />
                        <button
                          onClick={() => {
                            if (certifiedNumber) setCertificationStatus('pending');
                          }}
                          disabled={!certifiedNumber}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${certifiedNumber ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-200 text-stone-400'}`}
                        >
                          申請する
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* POST DETAIL VIEW (Modal-like) */}
        {selectedPost && (
          <div className="bg-white min-h-full">
            <div className="relative h-64">
              <img src={selectedPost.image} className="w-full h-full object-cover" alt="" />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 -mt-6 bg-white rounded-t-3xl relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-stone-800">{selectedPost.material}</h2>
                    {selectedPost.type === 'review' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{selectedPost.category}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-sm mt-2">
                    <div className="flex items-center gap-2 text-stone-600 font-medium">
                      <User className="w-4 h-4" />
                      {selectedPost.user}
                      {renderUserBadge(selectedPost.isCertified, selectedPost.likes)}
                    </div>
                    {selectedPost.attribute && (
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded w-fit">
                        {selectedPost.attribute}
                      </span>
                    )}
                  </div>
                </div>
                {selectedPost.type === 'review' && selectedPost.rating && (
                  <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100">
                    <div className="flex text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w - 3 h - 3 ${i < selectedPost.rating ? 'fill-current' : 'text-stone-300'} `} />
                      ))}
                    </div>
                    <span className="font-bold text-yellow-600 text-lg">{selectedPost.rating}.0</span>
                  </div>
                )}
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-stone">
                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">
                  {selectedPost.type === 'review' ? 'レビュー内容' : '投稿内容'}
                </h4>
                <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <div className="flex items-center justify-between text-stone-400 text-sm">
                  <span>投稿日: {selectedPost.date}</span>
                  <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" /> {selectedPost.likes} いいね
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- POSTWALL MODAL --- */}
      {
        showLockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLockModal(false)}></div>
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 text-center shadow-2xl animate-pop-in">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">レビュー閲覧制限</h3>
              <p className="text-stone-500 mb-6 text-sm leading-relaxed">
                地域の農家の詳細なレビューを見るためには、<br />
                あなたも最低1件の<span className="font-bold text-emerald-600">資材レビュー</span>を<br />
                投稿する必要があります。
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowLockModal(false);
                    setPostMode('review');
                    setActiveTab('record');
                  }}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  最初のレビューを書く
                </button>
                <button
                  onClick={() => setShowLockModal(false)}
                  className="text-stone-400 text-sm hover:text-stone-600 underline"
                >
                  あとにする
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* --- POST CIRCLE MENU OVERLAY --- */}
      {
        showPostMenu && (
          <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm animate-fade-in touch-none">
            {/* Menu Container */}
            <div className="absolute inset-0">

              {/* Central Button (Photo Post) - TRUE CENTER */}
              <div
                className="absolute z-20 flex flex-col items-center justify-center animate-pop-in cursor-pointer"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                onClick={() => handleMenuClick('photo')}
              >
                <button
                  className="w-[90px] h-[90px] bg-emerald-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)] border-[5px] border-white hover:scale-105 active:scale-95 transition-transform"
                >
                  <Camera className="w-9 h-9 text-white mb-0.5" />
                  <span className="text-[10px] font-bold text-white leading-none">写真で記録</span>
                </button>
              </div>

              {/* Close Button (Bottom) */}
              <div
                className="absolute z-20 flex flex-col items-center justify-center animate-pop-in cursor-pointer"
                style={{ left: '50%', bottom: '30px', transform: 'translate(-50%, 0)' }}
                onClick={() => setShowPostMenu(false)}
              >
                <button
                  className="w-[44px] h-[44px] bg-white text-stone-400 hover:text-stone-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-medium text-white mt-1 opacity-70">閉じる</span>
              </div>

              {/* Surrounding Buttons (5 items, 72° apart) - orbiting around top:50% center */}
              {[
                { label: '資材レビュー', icon: Star, angle: 90, type: 'review' },
                { label: 'アルバム', icon: Images, angle: 162, type: 'album' },
                { label: 'ブログ', icon: PenTool, angle: 234, type: 'blog' },
                { label: '作業日誌', icon: ClipboardList, angle: 306, type: 'diary' },
                { label: '購入記録', icon: ShoppingCart, angle: 18, type: 'purchase' },
              ].map((item, index) => {
                const radius = 130;
                const angleRad = item.angle * (Math.PI / 180);
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;
                return (
                  <div
                    key={index}
                    className="absolute z-10 flex flex-col items-center justify-center animate-pop-in"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% - ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${index * 0.06}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <button
                      onClick={() => handleMenuClick(item.type)}
                      className="w-[68px] h-[68px] bg-gradient-to-b from-white to-stone-50 rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.18)] active:scale-90 transition-transform hover:shadow-xl hover:scale-105 border-2 border-white/80"
                    >
                      <item.icon className="w-7 h-7 text-emerald-600" />
                    </button>
                    <span className="text-[11px] font-bold text-white mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      {/* --- BOTTOM NAVIGATION --- */}
      {
        !selectedPost && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-stone-200 px-2 pt-2 pb-safe flex justify-around items-end z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ minHeight: '70px' }}>
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-1.5 px-3 transition-colors min-w-[56px] ${activeTab === 'home' ? 'text-emerald-600' : 'text-stone-400'}`}
            >
              <Home className="w-7 h-7 mb-0.5" />
              <span className="text-[11px] font-bold">ホーム</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex flex-col items-center py-1.5 px-3 transition-colors min-w-[56px] ${activeTab === 'community' ? 'text-emerald-600' : 'text-stone-400'}`}
            >
              <Users className="w-7 h-7 mb-0.5" />
              <span className="text-[10px] font-bold">コミュニティ</span>
            </button>

            {/* Floating Action Button for Record (Post Menu Trigger) */}
            <div className="relative -top-5 flex flex-col items-center">
              <button
                id="record-button"
                onClick={() => setShowPostMenu(true)}
                className="w-[64px] h-[64px] rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.4)] flex items-center justify-center border-4 border-white transition-transform active:scale-90 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
              >
                <Plus className="w-8 h-8" />
              </button>
              <span className="text-[10px] font-bold text-stone-500 mt-1">記録</span>
            </div>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center py-1.5 px-3 transition-colors min-w-[56px] ${activeTab === 'search' ? 'text-emerald-600' : 'text-stone-400'}`}
            >
              <Search className="w-7 h-7 mb-0.5" />
              <span className="text-[11px] font-bold">検索</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center py-1.5 px-3 transition-colors min-w-[56px] ${activeTab === 'profile' ? 'text-emerald-600' : 'text-stone-400'}`}
            >
              <User className="w-7 h-7 mb-0.5" />
              <span className="text-[10px] font-bold">マイページ</span>
            </button>
          </nav>
        )
      }

      {/* Settings Modal */}
      {
        showSettingsModal && (
          <div className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in touch-none">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
              <div className="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
                <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-stone-500" />
                  設定・サポート
                </h2>
                <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors">
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-2">
                  <h3 className="font-bold text-stone-700 text-sm pl-1">アカウント設定</h3>
                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 shadow-sm">
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 flex justify-between items-center">
                      メールアドレスの変更 <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 flex justify-between items-center">
                      電話番号の変更 <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 flex justify-between items-center">
                      パスワードの変更 <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-stone-700 text-sm pl-1">サポート</h3>
                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 shadow-sm">
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 flex justify-between items-center">
                      バグを報告する <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 flex justify-between items-center">
                      改善の要望を送る <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 flex justify-between items-center">
                      ヘルプセンター <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 pb-8">
                  <button className="w-full py-3 text-sm font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    ログアウト
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Notifications Modal */}
      {
        showNotificationsModal && (
          <div className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in touch-none">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
              <div className="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
                <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-stone-500" />
                  お知らせ
                </h2>
                <button onClick={() => setShowNotificationsModal(false)} className="p-2 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors">
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
              <div className="p-0 overflow-y-auto flex-1 bg-stone-50">
                <div className="divide-y divide-stone-100">
                  <div className="bg-white p-4 flex gap-3 cursor-pointer hover:bg-stone-50 transition-colors relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-5 left-2"></div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <AlertCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-800 font-bold mb-1 leading-tight">あなたと同じ「トマト」を栽培している農家さんが新しい資材レビューを投稿しました</p>
                      <p className="text-xs text-stone-500">2時間前</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 flex gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-800 mb-1 leading-tight"><strong>田中ファーム</strong>さんからフォローリクエストが届きました</p>
                      <div className="flex gap-2 mt-2">
                        <button className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">承認する</button>
                        <button className="bg-stone-200 text-stone-700 text-xs font-bold px-4 py-1.5 rounded-full">削除</button>
                      </div>
                      <p className="text-xs text-stone-500 mt-2">昨日</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 flex gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex flex-col items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-800 mb-1 leading-tight">過去に使用した「ダコニール」に関する新しい知見が追加されました</p>
                      <p className="text-xs text-stone-500">3日前</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* CREATE COMMUNITY MODAL */}
      {showCreateCommunity && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowCreateCommunity(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl animate-pop-in">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              新しいコミュニティを作成
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">コミュニティ名</label>
                <input
                  type="text"
                  value={newCommunityName}
                  onChange={e => setNewCommunityName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="例: 有機野菜を育てる会"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">説明</label>
                <textarea
                  value={newCommunityDesc}
                  onChange={e => setNewCommunityDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24"
                  placeholder="どんなコミュニティですか？"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowCreateCommunity(false)}
                  className="flex-1 py-3 text-stone-600 font-bold bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    if (newCommunityName.trim()) {
                      showComingSoon('コミュニティの作成');
                      setShowCreateCommunity(false);
                      setNewCommunityName('');
                      setNewCommunityDesc('');
                    }
                  }}
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors ${newCommunityName.trim() ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-300'}`}
                  disabled={!newCommunityName.trim()}
                >
                  作成する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Coming Soon */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce-in">
          <div className="bg-stone-800 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes pop-in { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes bounce-in { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* Safari safe area padding */
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
      `}</style>
    </div >
  );
}
