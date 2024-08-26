module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier', // 이 줄을 추가하여 ESLint와 Prettier의 충돌을 방지합니다
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error', // Prettier 규칙을 ESLint에 통합
    },
  };
  