export async function getCurrentUser() {
  const response = await fetch('/api/user');
  return await response.json();
}

export async function login(form: Record<string, unknown>): Promise<Response> {
  return await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });
}
export async function logout(): Promise<Response> {
  return await fetch('/api/auth/logout');
}

export async function createAccount(createForm: Record<string, unknown>): Promise<Response> {
  return await fetch('/api/accounts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createForm),
  });
}

export async function findAccounts(findForm: Record<string, unknown>): Promise<Response> {
  return await fetch('/api/accounts/find', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(findForm),
  });
}

export async function editAccount(_id: string, editForm: Record<string, unknown>) {
  editForm._id = _id;
  await fetch('/api/accounts/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editForm),
  });
  return {
    _id,
    accountType: editForm.type,
    name: editForm.name,
    lastname: editForm.lastname,
    subject: editForm.subject,
    class: editForm.class,
  };
}

export async function resetPassword(_id: string) {
  const res = await fetch('/api/accounts/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id }),
  });
  return await res.text();
}

export function transliterate(str: string): string {
  return str
    .replace(/\u0401/g, 'YO')
    .replace(/\u0419/g, 'I')
    .replace(/\u0426/g, 'TS')
    .replace(/\u0423/g, 'U')
    .replace(/\u041A/g, 'K')
    .replace(/\u0415/g, 'E')
    .replace(/\u041D/g, 'N')
    .replace(/\u0413/g, 'G')
    .replace(/\u0428/g, 'SH')
    .replace(/\u0429/g, 'SCH')
    .replace(/\u0417/g, 'Z')
    .replace(/\u0425/g, 'H')
    .replace(/\u042A/g, '')
    .replace(/\u0451/g, 'yo')
    .replace(/\u0439/g, 'i')
    .replace(/\u0446/g, 'ts')
    .replace(/\u0443/g, 'u')
    .replace(/\u043A/g, 'k')
    .replace(/\u0435/g, 'e')
    .replace(/\u043D/g, 'n')
    .replace(/\u0433/g, 'g')
    .replace(/\u0448/g, 'sh')
    .replace(/\u0449/g, 'sch')
    .replace(/\u0437/g, 'z')
    .replace(/\u0445/g, 'h')
    .replace(/\u044A/g, "'")
    .replace(/\u0424/g, 'F')
    .replace(/\u042B/g, 'I')
    .replace(/\u0412/g, 'V')
    .replace(/\u0410/g, 'a')
    .replace(/\u041F/g, 'P')
    .replace(/\u0420/g, 'R')
    .replace(/\u041E/g, 'O')
    .replace(/\u041B/g, 'L')
    .replace(/\u0414/g, 'D')
    .replace(/\u0416/g, 'ZH')
    .replace(/\u042D/g, 'E')
    .replace(/\u0444/g, 'f')
    .replace(/\u044B/g, 'i')
    .replace(/\u0432/g, 'v')
    .replace(/\u0430/g, 'a')
    .replace(/\u043F/g, 'p')
    .replace(/\u0440/g, 'r')
    .replace(/\u043E/g, 'o')
    .replace(/\u043B/g, 'l')
    .replace(/\u0434/g, 'd')
    .replace(/\u0436/g, 'zh')
    .replace(/\u044D/g, 'e')
    .replace(/\u042F/g, 'Ya')
    .replace(/\u0427/g, 'CH')
    .replace(/\u0421/g, 'S')
    .replace(/\u041C/g, 'M')
    .replace(/\u0418/g, 'I')
    .replace(/\u0422/g, 'T')
    .replace(/\u042C/g, "'")
    .replace(/\u0411/g, 'B')
    .replace(/\u042E/g, 'YU')
    .replace(/\u044F/g, 'ya')
    .replace(/\u0447/g, 'ch')
    .replace(/\u0441/g, 's')
    .replace(/\u043C/g, 'm')
    .replace(/\u0438/g, 'i')
    .replace(/\u0442/g, 't')
    .replace(/\u044C/g, "'")
    .replace(/\u0431/g, 'b')
    .replace(/\u044E/g, 'yu');
}
