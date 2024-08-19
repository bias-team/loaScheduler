export async function fetchRaidList() {
    // 서버에서 레이드 목록을 가져옵니다.
    const response = await fetch('/api/raids');
    return await response.json();
  }
  
  export async function addRaid(raidData) {
    // 새로운 레이드를 추가합니다.
    const response = await fetch('/api/raids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(raidData),
    });
    return await response.json();
  }
  
  export async function updateRaid(raidId, updatedData) {
    // 특정 레이드를 수정합니다.
    const response = await fetch(`/api/raids/${raidId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  }
  
  export async function deleteRaid(raidId) {
    // 레이드를 삭제합니다. 여기서는 POST 요청을 사용하여 삭제를 처리합니다.
    const response = await fetch('/api/delete-raid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: raidId }),
    });
    return await response.json();
  }
  
  export async function fetchMemberList() {
    // 서버에서 캐릭터 목록을 가져옵니다.
    const response = await fetch('/api/members');
    return await response.json();
  }
  
  export async function addMember(memberData) {
    // 새로운 캐릭터를 추가합니다.
    const response = await fetch('/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });
    return await response.json();
  }
  
  export async function updateMember(memberId, updatedData) {
    // 특정 캐릭터를 수정합니다.
    const response = await fetch(`/api/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  }
  
  export async function deleteMember(memberId) {
    // 캐릭터를 삭제합니다. 여기서도 POST 요청을 사용하여 삭제를 처리합니다.
    const response = await fetch('/api/delete-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: memberId }),
    });
    return await response.json();
  }
  