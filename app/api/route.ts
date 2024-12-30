import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructions =
  'Kamu adalah seorang code auditor yang hebat, lakukan pengecekan terhadap syntax pseudocode dengan strict dan abaikan fungsi primitif, jika dalam pseudocode ada bagian yang menjadi issue (salah, tidak valid, typo, tidak dapat dicompile, tidak dapat dijalankan) maka berikan errorMessage, jika pseudocode tidak memiliki issue sama sekali, maka convert menjadi exact code c++ yang sama tanpa melengkapi dan tanpa menyempurnakan code tersebut, tidak ada keharusan untuk memberikan output code yang lengkap, cukup berikan code c++ yang sesuai dengan syntax pseudocode yang diberikan';
// 'Ubahlah syntax pseudocode yang diberikan exactly dan strict menjadi code dalam bahasa c++, lakukan pengecekan terhadap syntax pseudocode se strict mungkin jika dalam syntax pseudocode ada bagian yang salah atau tidak valid atau tidak sesuai maka berikan response errorMessage yang sesuai, jangan perbaiki jika ada typo maupun kesalahan dan jangan ubah syntax pseudocode yang diberikan, berikan response code tanpa formatting markdown';

const json_schema = {
  name: 'pseudocode-to-cpp',
  schema: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Output code dalam bahasa c++ tanpa formatting',
      },
      success: { type: 'boolean' },
      errorMessage: {
        type: 'string',
        description:
          'Pesan Error dalam bahasa indonesia jika pseudocode yang diberikan memiliki issue',
      },
    },
    required: ['code', 'success', 'errorMessage'],
    additionalProperties: false,
  },
  strict: true,
};

export async function POST(request: Request) {
  const data = await request.json();
  console.log({ data });

  // await new Promise((resolve) => setTimeout(resolve, 5_000));
  // return Response.json({
  //   code: '',
  //   success: false,
  //   errorMessage: 'Dummy Timeout Error',
  // });

  if (!data || !data.pseudocode) {
    return Response.json({
      success: false,
      errorMessage: 'Pseudocode cannot be empty',
    });
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: instructions,
      },
      {
        role: 'user',
        content: data.pseudocode,
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema,
    },
    temperature: 0,
  });

  if (
    !completion.choices ||
    !completion.choices[0] ||
    !completion.choices[0].message ||
    !completion.choices[0].message.content
  ) {
    return Response.json({
      success: false,
      errorMessage: 'Failed to complete the request',
    });
  }

  const jsonResponse = JSON.parse(completion.choices[0].message.content);
  console.log({ jsonResponse });

  return Response.json(jsonResponse);
}
