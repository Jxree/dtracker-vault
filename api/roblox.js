export default async function handler(req, res) {
  var userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    var [userRes, avatarRes] = await Promise.all([
      fetch('https://users.roblox.com/v1/users/' + userId),
      fetch('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=' + userId + '&size=150x150&format=Png&isCircular=false')
    ]);

    var userData = await userRes.json();
    var avatarData = await avatarRes.json();

    res.status(200).json({
      displayName: userData.displayName || userData.name || null,
      username: userData.name || null,
      avatarUrl: avatarData.data && avatarData.data[0] ? avatarData.data[0].imageUrl : null
    });
  } catch(e) {
    res.status(500).json({ error: 'Failed to fetch Roblox data' });
  }
}
