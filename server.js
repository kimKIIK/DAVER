const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Render에서 PORT 환경 변수를 제공

// 메모리 내 임시 저장소 (데이터베이스 대체)
let comments = [];

// 미들웨어
app.use(cors());
app.use(bodyParser.json());

// 댓글 조회
app.get('/comments', (req, res) => {
    res.json(comments);
});

// 댓글 추가
app.post('/comments', (req, res) => {
    const { nickname, text } = req.body;
    if (!nickname || !text) {
        return res.status(400).json({ error: '닉네임과 댓글 내용을 입력해주세요.' });
    }

    const newComment = {
        id: Date.now(),
        nickname,
        text,
        timestamp: new Date()
    };

    comments.unshift(newComment); // 최신순으로 정렬
    res.json(newComment);
});

// 댓글 삭제
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    const adminCode = req.body.adminCode;

    if (adminCode !== 'ADMIN12345') {
        return res.status(403).json({ error: '관리자 코드가 올바르지 않습니다.' });
    }

    const index = comments.findIndex(comment => comment.id === parseInt(id));
    if (index !== -1) {
        comments.splice(index, 1);
        return res.json({ success: true });
    } else {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }
});

// 기본 경로
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
