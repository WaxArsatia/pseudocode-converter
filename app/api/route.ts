import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructions =
  'Berikan response dalam bahasa indonesia, Ubahlah syntax pseudocode yang diberikan exactly dan strict menjadi code dalam bahasa c++, jika syntax pseudocode tidak valid atau tidak sesuai dengan format pseudocode maka berikan response errorMessage yang sesuai, jangan perbaiki dan jangan ubah syntax pseudocode yang diberikan, berikan response code tanpa formatting markdown, tetap berikan fleksibilitas pada penulisan pseudocode yang diberikan';

const json_schema = {
  name: 'pseudocode-to-cpp',
  schema: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Output code dalam bahasa c++',
      },
      success: { type: 'boolean' },
      errorMessage: {
        type: 'string',
        description:
          'Pesan Error jika syntax pseudocode yang dimasukkan salah atau tidak valid',
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
