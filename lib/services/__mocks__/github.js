const exchangeCodeForToken = async (code) => {
  // eslint-disable-next-line no-console
  console.log(`CALLING MOCK exchangeCodeForToken ${code}`);
  return 'MOCK TOKEN FOR CODE';
};

const getGithubProfile = async (token) => {
  // eslint-disable-next-line no-console
  console.log(`CALLING MOCK getGithubProfile ${token}`);
  return {
    login: 'phonyUser',
    email: 'fake@phony.com',
    avatar_url: 'https://www.heyguyshesaphony.com/jpg/420/69',
  };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
