const fs = require('fs');
const path = require('path');

const content = `erDiagram
  users {
    String id
    String name
    String email
    String password
    user_role role
    user_level level
    DateTime created_at
    DateTime updated_at
  }
  programs {
    String id
    String title
    String description
    String cover_image
    DateTime created_at
  }
  videos {
    String id
    String program_id
    String title
    String description
    String youtube_url
    String audience
    Int order_index
    DateTime created_at
  }
  resources {
    String id
    String program_id
    String title
    String description
    String file_url
    DateTime created_at
  }
  user_progress {
    String id
    String user_id
    String program_id
    Int total_videos
    Int watched_videos
    Decimal percent_complete
    DateTime updated_at
  }
  watch_history {
    String id
    String user_id
    String video_id
    Int last_timestamp
    Int times_watched
    Boolean is_completed
    DateTime updated_at
  }
  admin_logs {
    String id
    String admin_id
    String action
    String entity
    String entity_id
    DateTime logged_at
  }
  user_role {
    value USER
    value ADMIN
  }
  user_level {
    value HIGH_SCHOOL
    value UNIVERSITY
    value EARLY_CAREER
  }
  users ||--o{ user_progress : "user_progress"
  users ||--o{ watch_history : "watch_history"
  users ||--o{ admin_logs : "admin_logs"
  programs ||--o{ videos : "videos"
  programs ||--o{ resources : "resources"
  programs ||--o{ user_progress : "user_progress"
  videos ||--o{ watch_history : "watch_history"
`;

fs.writeFileSync(path.join(__dirname, '../prisma/ERD.mmd'), content, 'utf8');
console.log('Wrote prisma/ERD.mmd');
