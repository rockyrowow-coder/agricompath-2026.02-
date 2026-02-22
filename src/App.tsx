// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Camera, Star, Send, Lock, Search, Home, Plus, User, X, ChevronRight, Sprout, Users, FileText, BadgeCheck, Filter, MessageSquare, Medal, ThumbsUp, Hash, UserPlus, Award, Images, ClipboardList, Tractor, PenTool, ArrowLeft, MapPin, Heart, MessageCircle, CheckCircle2, Flame, Mic } from 'lucide-react';
import { subDays, isAfter } from 'date-fns';

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
  { id: 1, name: '施設園芸 意見交換会', members: 128, active: true },
  { id: 2, name: '【関東】新規就農者の集い', members: 45, active: false },
  { id: 3, name: 'スマート農業導入事例', members: 312, active: true },
];

const MOCK_MATERIALS = [
  { name: 'マラソン乳剤', category: '農薬', target: '害虫' },
  { name: 'アファーム乳剤', category: '農薬', target: '害虫' },
  { name: 'ダコニール1000', category: '農薬', target: '病気' },
  { name: 'ベンレート水和剤', category: '農薬', target: '病気' },
  { name: 'ラウンドアップ', category: '農薬', target: '雑草' },
  { name: 'マイガーデンベジフル', category: '肥料', target: '元肥' },
  { name: 'マグァンプK', category: '肥料', target: '元肥' },
  { name: 'ハイポネックス原液', category: '肥料', target: '追肥' },
  { name: 'ペンタキープSuper', category: '肥料', target: '葉面散布' },
  { name: '桃太郎（トマト）', category: '種苗', target: '夏秋' },
  { name: 'みさき（キャベツ）', category: '種苗', target: '春まき' },
  { name: '防草シート', category: 'その他', target: '資材' },
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
  const [reviewTiming, setReviewTiming] = useState('');
  const [reviewTemp, setReviewTemp] = useState('');

  // UI State for Community
  const [communityTab, setCommunityTab] = useState('timeline'); // 'timeline', 'manage'
  // const [selectedCommunity, setSelectedCommunity] = useState(null);

  // My Page State
  // const [myPageFilter, setMyPageFilter] = useState('all'); // 'all', 'photo', 'album', 'review', 'blog', 'tweet', 'harvest'
  const [isCertifiedSaved, setIsCertifiedSaved] = useState(currentUser.isCertified);

  // Profile State (remaining from original, certifiedNumber is still here)
  const [activeProfileTab, setActiveProfileTab] = useState('posts'); // posts, friends, settings
  const [certifiedNumber, setCertifiedNumber] = useState('');

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

    setTimeout(() => {
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

      setPosts([newPost, ...posts]);
      setHasPosted(true);
      setIsSubmitting(false);
      setShowConfetti(true);

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


      setTimeout(() => {
        setShowConfetti(false);
        setActiveTab('home');
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

  // const getRankInfo = (likes: number) => { // This was replaced by the user's instruction
  //   if (likes >= 50) return { name: 'ゴールド', iconColor: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
  //   if (likes >= 10) return { name: 'シルバー', iconColor: 'text-stone-400', bgColor: 'bg-stone-50', borderColor: 'border-stone-200' };
  //   return { name: 'ブロンズ', iconColor: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
  // };
  // const myRank = getRankInfo(myTotalLikes); // This was replaced by the user's instruction

  // Helper for rendering badges
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
    const userPosts = posts.filter(p => p.author.id === user.id);

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
          <div className="bg-white px-4 py-3 border-b border-stone-200 shadow-sm sticky top-14 z-10 flex items-center">
            <FileText className="w-4 h-4 text-stone-500 mr-2" />
            <h3 className="font-bold text-stone-800 text-sm">投稿一覧</h3>
          </div>

          {userPosts.map(post => (
            <div key={post.id} className="bg-white mb-2 shadow-sm border-t border-b border-stone-100 p-3" onClick={() => setSelectedPost(post)}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="relative">
                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-8 h-8 rounded-full object-cover mr-2" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-800 flex items-center gap-1">
                      {post.author.name}
                    </div>
                    <div className="text-[10px] text-stone-500">{post.timestamp}</div>
                  </div>
                </div>
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-md">{post.community}</span>
              </div>
              {post.type === 'album' && post.imageUrls && post.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {post.imageUrls.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img src={url} alt={`album - ${index}`} className="w-full h-full object-cover rounded-md" />
                    </div>
                  ))}
                </div>
              )}
              {post.type !== 'album' && post.image && (
                <img src={post.image} alt="post" className="w-full h-48 object-cover rounded-lg mb-2" />
              )}
              <p className="text-sm text-stone-700 mb-2 line-clamp-2">{post.content}</p>
              <div className="flex items-center text-stone-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
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

      {/* --- OVERLAYS --- */}
      <header className="bg-emerald-600 text-white p-4 shadow-md z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6" />
          <h1 className="font-bold text-lg tracking-wider">AgriReview</h1>
        </div>
        <div className="flex items-center gap-3">
          {!hasPosted && (
            <div className="text-[10px] bg-emerald-800 px-2 py-1 rounded-full animate-pulse font-bold">
              閲覧制限中
            </div>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto pb-20 scroll-smooth">

        {/* TIMELINE VIEW (Home) */}
        {activeTab === 'home' && !selectedPost && (
          <div className="space-y-4">

            {/* 今日のおすすめ (Horizontal Scroll) */}
            <div className="bg-white p-4 pb-6 shadow-sm border-b border-stone-100">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-stone-700">今日のおすすめ</h2>
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

            {/* Timeline */}
            <div className="p-4 space-y-4 pt-0">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <h2 className="font-bold text-stone-700">おすすめの投稿</h2>
              </div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer border border-stone-100"
                >
                  {/* Image Section */}
                  <div className="relative h-40 bg-stone-200">
                    <img src={post.image} alt={post.material} className="w-full h-full object-cover" />

                    {/* Badge: Review or Post */}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
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

                    {/* Category Label */}
                    {post.type === 'review' && (
                      <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm">
                        {post.category}
                      </div>
                    )}

                    {/* Rating Badge (Only for reviews) */}
                    {post.type === 'review' && post.rating && (
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center shadow-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < post.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}`} />
                        ))}
                        <span className="ml-1 text-xs font-bold text-stone-700">{post.rating}.0</span>
                      </div>
                    )}

                    {/* Lock Overlay for Non-Posters */}
                    {!hasPosted && post.author.id !== currentUser.id && post.type === "review" && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-black/40" onClick={() => {/* ... */ }}>
                        <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">投稿してロック解除</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-stone-800 leading-tight">{post.material}</h3>
                      <span className="text-[10px] text-stone-400">{post.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-stone-600 font-medium cursor-pointer hover:underline" onClick={(e) => {
                        e.stopPropagation();
                        setViewedUser(post.author);
                      }}>{post.author.name}</span>
                      {renderUserBadge(post.author.isCertified, post.likes)}
                    </div>

                    <p className={`text-sm text-stone-600 line-clamp-2 ${!hasPosted && post.author.id !== currentUser.id && post.type === "review" ? "blur-sm select-none" : ""}`}>
                      {post.content}
                    </p>

                    {/* Action indicators */}
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
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY VIEW */}
        {activeTab === 'community' && !selectedPost && (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-white border-b border-stone-100 sticky top-0 z-10 pb-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-stone-800">コミュニティ</h2>
                <button className="text-emerald-600 text-sm font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                  <Plus className="w-4 h-4" />
                  作成する
                </button>
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
                <button
                  onClick={() => setCommunityTab('manage')}
                  className={`whitespace-nowrap pb-3 text-sm font-bold text-center border-b-2 transition-all flex items-center gap-1 ${communityTab === 'manage' ? 'border-stone-600 text-stone-700' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                >
                  管理
                </button>
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
          <div className="p-4 h-full flex flex-col">
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
                      <div className="grid grid-cols-4 gap-2">
                        {['農薬', '肥料', '種苗', 'その他'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryChange(cat)}
                            className={`py-2 rounded-lg text-xs font-bold transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-stone-600 border border-stone-200'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Usage Period and Temperature */}
                    <div className="flex gap-4 animate-pop-in">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">使用時期（任意）</label>
                        <input type="text" value={reviewTiming} onChange={(e) => setReviewTiming(e.target.value)} placeholder="例: 定植後、梅雨" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-sm" />
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

                {/* Harvest Mode */}
                {postMode === 'harvest' && (
                  <div className="flex gap-4 animate-pop-in">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">作物名</label>
                      <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="例: トマト（桃太郎）" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" required />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">収量・規格</label>
                      <input type="text" value={harvestAmount} onChange={(e) => setHarvestAmount(e.target.value)} placeholder="例: A品 20箱" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" required />
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

                {/* Free Text (Placeholder changes by mode) */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={(() => {
                    if (postMode === 'review') return reviewRating === 0 || !materialName || !reviewText;
                    if (postMode === 'blog' || postMode === 'album') return !postTitle;
                    if (postMode === 'harvest') return !materialName || !harvestAmount;
                    if (postMode === 'diary') return !materialName || !workTime;
                    return !reviewText && !photoPreview;
                  })()}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform
                    ${(true) // CSS側の disabled で制御されるため、ここは常に true 評価で基本色を当てる
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:translate-y-1 shadow-emerald-200 disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed'
                      : ''
                    }
`}
                >
                  <Send className="w-5 h-5" />
                  記録して共有
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
                  {myPosts.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-stone-300">
                      <p className="text-stone-500 text-sm mb-4">まだ投稿がありません。</p>
                      <button onClick={() => setActiveTab('record')} className="text-emerald-600 font-bold text-sm underline">
                        最初の投稿をする
                      </button>
                    </div>
                  ) : (
                    myPosts.map((post: any) => (
                      <div key={`mypage-post-${post.id}`} className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-stone-100 flex flex-col p-4 animate-fade-in group hover:shadow-md transition-shadow relative cursor-pointer" onClick={() => handlePostClick(post)}>
                        <div className="flex gap-3 relative z-10 w-full mb-3">
                          <div className="w-[100px] h-[100px] flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden relative">
                            <img
                              src={post.imageUrls?.[0] || post.image || "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=200&h=200&fit=crop"}
                              alt={post.material || post.title || "Post image"}
                              className="w-full h-full object-cover"
                            />
                            {/* Badge: Review or Post */}
                            <div className="absolute top-1 left-1 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-sm flex items-center gap-1">
                              {(() => {
                                const info = getPostTypeInfo(post.type);
                                const Icon = info.icon;
                                return (
                                  <>
                                    <Icon className={`w-2.5 h-2.5 ${info.color} ${post.type === 'review' ? 'fill-current' : ''}`} />
                                    {info.label}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base text-stone-800 line-clamp-2 mb-1 leading-tight">
                              {post.material || post.title || post.content.split('\n')[0]}
                            </h4>
                            <p className="text-xs text-stone-500 line-clamp-2 mb-2">{post.content}</p>
                            {post.type === 'review' ? (
                              <div className="flex items-center gap-1 text-xs mt-1">
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{post.rating}.0</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w - 3 h - 3 ${star <= (post.rating || 0) ? 'text-yellow-400 fill-current' : 'text-stone-300'} `} />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-1 overflow-hidden mt-1 max-w-full">
                                {(post.tags || []).slice(0, 2).map((tag: string, i: number) => (
                                  <span key={i} className="text-[10px] text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap overflow-hidden text-ellipsis flex-shrink max-w-[60px] line-clamp-1 leading-3 flex items-center h-4">#{tag}</span>
                                ))}
                                {((post.tags?.length || 0) > 2) && <span className="text-[10px] text-stone-400 px-1 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis flex-shrink flex items-center h-4">+{(post.tags?.length || 0) - 2}</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-1 relative w-full pt-1">
                          <span className="text-[10px] text-stone-400 w-auto whitespace-nowrap overflow-hidden text-ellipsis flex-1 pr-1">{post.date || post.timestamp}</span>
                          <div className="flex items-center gap-1 text-stone-500 bg-stone-50 px-2 py-1 rounded-lg flex-shrink-0">
                            <ThumbsUp className="w-3 h-3" />
                            <span className="text-xs font-bold">{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Friends Tab */}
              {activeProfileTab === 'friends' && (
                <div className="bg-white p-6 rounded-2xl border border-stone-100 text-center">
                  <UserPlus className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                  <h3 className="font-bold text-stone-700 mb-2">友達機能は準備中</h3>
                  <p className="text-sm text-stone-500 mb-4">地域や作物が近い農家さんをフォローして、情報交換できるようになります。</p>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-sm w-full">友達をアプリに招待する</button>
                </div>
              )}

              {/* Settings Tab */}
              {activeProfileTab === 'settings' && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-stone-700">認定農業者情報</h3>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 leading-relaxed bg-stone-50 p-3 rounded-lg">
                    認定農業者番号を登録すると、プロフィールに「✅認証バッジ」が付き、レビューの信頼性が大きく向上します。
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={certifiedNumber}
                      onChange={(e) => {
                        setCertifiedNumber(e.target.value);
                        setIsCertifiedSaved(false);
                      }}
                      placeholder="例: 12345678"
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                    <button
                      onClick={() => setIsCertifiedSaved(true)}
                      disabled={!certifiedNumber}
                      className={`px - 4 py - 2 rounded - lg font - bold text - sm transition - colors ${certifiedNumber ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-200 text-stone-400'} `}
                    >
                      {isCertifiedSaved ? '保存済' : '保存'}
                    </button>
                  </div>
                  {isCertifiedSaved && (
                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4" /> 認証バッジが有効になりました
                    </p>
                  )}
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
      {showLockModal && (
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
      )}

      {/* --- POST CIRCLE MENU OVERLAY --- */}
      {showPostMenu && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm animate-fade-in touch-none">
          {/* Menu Container */}
          <div className="absolute inset-0">

            {/* Central Button (Photo Post) */}
            <div
              className="absolute z-20 flex flex-col items-center justify-center animate-pop-in cursor-pointer"
              style={{ left: '50%', bottom: 'calc(env(safe-area-inset-bottom, 20px) + 140px)', transform: 'translate(-50%, 50%)' }}
              onClick={() => handleMenuClick('photo')}
            >
              <button
                className="w-[102px] h-[102px] bg-emerald-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)] border-[5px] border-white hover:scale-105 active:scale-95 transition-transform"
              >
                <Camera className="w-10 h-10 text-white mb-1" />
                <span className="text-[11px] font-bold text-white leading-none">写真で記録</span>
              </button>
            </div>

            {/* Close Button (Slightly Below Center) */}
            <div
              className="absolute z-20 flex flex-col items-center justify-center animate-pop-in cursor-pointer"
              style={{ left: '50%', bottom: 'calc(env(safe-area-inset-bottom, 20px) + 30px)', transform: 'translate(-50%, 50%)' }}
              onClick={() => setShowPostMenu(false)}
            >
              <button
                className="w-[44px] h-[44px] bg-white text-stone-400 hover:text-stone-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-medium text-white mt-1 opacity-70">閉じる</span>
            </div>

            {/* Surrounding Buttons (Circular arrangement) */}
            {[
              { label: 'アルバム', icon: Images, angle: -180, type: 'album' },
              { label: '資材レビュー', icon: Star, angle: -144, type: 'review' },
              { label: 'ブログ', icon: PenTool, angle: -108, type: 'blog' },
              { label: 'つぶやき', icon: MessageSquare, angle: -72, type: 'tweet' },
              { label: '作業日誌', icon: ClipboardList, angle: -36, type: 'diary' },
              { label: '収穫記錄', icon: Tractor, angle: 0, type: 'harvest' },
            ].map((item, index) => {
              const radius = 135; // 半径(px) => distance from center photo button
              const angleRad = item.angle * (Math.PI / 180);
              const x = Math.cos(angleRad) * radius;
              // Center Y is 140px. Y decreases as it goes down.
              const y = Math.sin(angleRad) * radius;
              return (
                <div
                  key={index}
                  className="absolute z-10 flex flex-col items-center justify-center animate-pop-in"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    bottom: `calc(env(safe-area-inset-bottom, 20px) + 140px - ${y}px)`,
                    transform: 'translate(-50%, 50%)',
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <button
                    onClick={() => handleMenuClick(item.type)}
                    className="w-[68px] h-[68px] bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-90 transition-transform hover:shadow-xl hover:scale-105"
                  >
                    <item.icon className="w-7 h-7 text-emerald-600" />
                  </button>
                  <span className="text-[12px] font-bold text-white mt-2 drop-shadow-md whitespace-nowrap">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      {!selectedPost && (
        <nav className="bg-white border-t border-stone-200 px-2 py-3 flex justify-around items-center z-10 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <Home className="w-7 h-7 mb-1" />
            <span className="text-[11px] font-bold">ホーム</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'community' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <Users className="w-7 h-7 mb-1" />
            <span className="text-[11px] font-bold">コミュニティ</span>
          </button>

          {/* Floating Action Button for Record (Post Menu Trigger) */}
          <div className="relative -top-8 px-2 flex flex-col items-center">
            <button
              id="record-button"
              onClick={() => setShowPostMenu(true)}
              className="w-[68px] h-[68px] rounded-full shadow-xl flex items-center justify-center border-[6px] border-stone-50 transition-transform active:scale-90 bg-emerald-500 text-white"
            >
              <Plus className="w-8 h-8" />
            </button>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[11px] font-bold transition-colors w-full text-center text-stone-500">
              記録
            </span>
          </div>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'search' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <Search className="w-7 h-7 mb-1" />
            <span className="text-[11px] font-bold">検索</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <User className="w-7 h-7 mb-1" />
            <span className="text-[11px] font-bold">マイページ</span>
          </button>
        </nav>
      )}

      {/* Custom Styles for Animation */}
      <style>{`
@keyframes pop -in {
  0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
}
  .animate - pop -in {
    animation: pop -in 0.3s cubic- bezier(0.175, 0.885, 0.32, 1.275);
        }
@keyframes bounce -in {
  0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
}
  .animate - bounce -in {
    animation: bounce -in 0.6s cubic- bezier(0.215, 0.610, 0.355, 1.000);
        }
@keyframes fade -in {
  from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate - fade -in {
  animation: fade -in 0.2s ease- out forwards;
        }
@keyframes slide - up {
          from { transform: translateY(100 %); }
          to { transform: translateY(0); }
}
        .animate - slide - up {
  animation: slide - up 0.3s cubic - bezier(0.16, 1, 0.3, 1) forwards;
}
        /* Safari safe area padding */
        .pb - safe {
  padding - bottom: env(safe - area - inset - bottom, 20px);
}
`}</style>
    </div>
  );
}
