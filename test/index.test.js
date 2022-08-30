const assert = require("assert");
const MYJSON = require("../index");

describe("my-json-parser", () => {
  describe("lexer", () => {
    it("should work", () => {
      let json = `\
{
  "identity": "large",
  "object\\"foo": null,
  "tool": false,
  "difficult": -947304937.3325515,
  "dead": ["smell", "bar"]
}`;
      let expect = [
        { type: "{", value: "{", line: 1, column: 1 },
        { type: "STRING", value: '"identity"', line: 2, column: 3 },
        { type: ":", value: ":", line: 2, column: 13 },
        { type: "STRING", value: '"large"', line: 2, column: 15 },
        { type: ",", value: ",", line: 2, column: 22 },
        { type: "STRING", value: '"object\\"foo"', line: 3, column: 3 },
        { type: ":", value: ":", line: 3, column: 16 },
        { type: "NULL", value: "null", line: 3, column: 18 },
        { type: ",", value: ",", line: 3, column: 22 },
        { type: "STRING", value: '"tool"', line: 4, column: 3 },
        { type: ":", value: ":", line: 4, column: 9 },
        { type: "BOOL", value: "false", line: 4, column: 11 },
        { type: ",", value: ",", line: 4, column: 16 },
        { type: "STRING", value: '"difficult"', line: 5, column: 3 },
        { type: ":", value: ":", line: 5, column: 14 },
        {
          type: "NUMBER",
          value: -947304937.3325515,
          line: 5,
          column: 16,
        },
        { type: ",", value: ",", line: 5, column: 34 },
        { type: "STRING", value: '"dead"', line: 6, column: 3 },
        { type: ":", value: ":", line: 6, column: 9 },
        { type: "[", value: "[", line: 6, column: 11 },
        { type: "STRING", value: '"smell"', line: 6, column: 12 },
        { type: ",", value: ",", line: 6, column: 19 },
        { type: "STRING", value: '"bar"', line: 6, column: 21 },
        { type: "]", value: "]", line: 6, column: 26 },
        { type: "}", value: "}", line: 7, column: 1 },
        { type: "EOF", value: "EOF", line: 7, column: 2 },
      ];

      let tokens = [];
      for (const token of MYJSON.genToken(json)) {
        tokens.push(token);
      }
      assert.deepEqual(tokens, expect);
    });
  });

  describe("stringify", () => {
    it("random 1", () => {
      let json = {
        adjective: {
          given: {
            post: -1305874130,
            through: false,
            ants: "lake",
            monkey: "practice",
            jack: "gather",
            related: 1583557856.9963179,
          },
          power: "orbit",
          community: "south",
          liquid: "relationship",
          author: "social",
          condition: false,
        },
        send: true,
        glass: "after",
        along: "sister",
        terrible: false,
        musical: 940642301,
      };

      assert.strictEqual(MYJSON.stringify(json), JSON.stringify(json));
    });

    it("random 2", () => {
      let json = [
        -917030705,
        {
          queen: {
            four: 1719317309,
            law: -1616310301.8309698,
            clothing: 1049850165.5139685,
            combination: "order",
            trouble: 1714450100.4240818,
            lunch: false,
          },
          chosen: "those",
          than: null,
          mind: "enter",
          milk: "fact",
          last: false,
        },
        "question",
        false,
        true,
        false,
      ];

      assert.strictEqual(MYJSON.stringify(json), JSON.stringify(json));
    });

    it("random 3", () => {
      let json = {
        curious: -951202073,
        design: false,
        mine: true,
        rise: false,
        leg: 'so\nng"foo',
        comfortable: [
          [
            1429010959,
            -906343150.1696768,
            492705261,
            974653269.4832096,
            "compare",
            "mission",
          ],
          "within",
          "similar",
          true,
          "whose",
          false,
        ],
      };

      assert.strictEqual(MYJSON.stringify(json), JSON.stringify(json));
    });
  });

  describe("parse", () => {
    it("should parse single value", () => {
      let val = '"foo bar"';
      assert.strictEqual(MYJSON.parse(val), JSON.parse(val));

      val = "true";
      assert.strictEqual(MYJSON.parse(val), JSON.parse(val));

      val = "false";
      assert.strictEqual(MYJSON.parse(val), JSON.parse(val));

      val = "null";
      assert.strictEqual(MYJSON.parse(val), JSON.parse(val));

      val = "-123.56";
      assert.strictEqual(MYJSON.parse(val), JSON.parse(val));
    });

    it("random 1", () => {
      let json = `\
  [
    -145372122.00353003,
    [
      "so",
      -675873615,
      {
        "separate": "job",
        "identity": "large",
        "object": "war",
        "tool": false,
        "difficult": -947304937.3325515,
        "dead": "smell"
      },
      false,
      -463320125,
      "way"
    ],
    "skill",
    -917230731.7413311,
    "where",
    true
  ]`;
      let ret = MYJSON.parse(json);
      // console.log("ret:", ret);

      assert.deepStrictEqual(ret, JSON.parse(json));
    });

    it("random 2", () => {
      let json = `\    
  [
    [
      {
        "development": -545951330,
        "thou": true,
        "play": "biggest",
        "region": 459630327,
        "explore": 105306500,
        "monkey": 1163235786.0373883
      },
      true,
      1547100207,
      -246523760,
      "thumb",
      1502769557.5119724
    ],
    false,
    false,
    849663793.2265344,
    "previous",
    false
  ]
      `;

      assert.deepStrictEqual(MYJSON.parse(json), JSON.parse(json));
    });

    it("random 3", () => {
      let json = `\
  {
    "born": "massage",
    "necessary": {
      "value": -392269822.380507,
      "copper": "accurate",
      "leather": true,
      "silly": "rays",
      "funny": "owner",
      "unhappy": false
    },
    "probably": 2092763820.7899766,
    "club": {
      "carefully": {
        "mark": "cry",
        "new": true,
        "iron": true,
        "play": "planning",
        "real": "development",
        "left": 1200965704
      },
      "other": 1525824359,
      "sugar": false,
      "people": "plastic",
      "up": "pool",
      "certain": true
    },
    "forget": "cost",
    "house": true
  }`;
      assert.deepStrictEqual(MYJSON.parse(json), JSON.parse(json));
    });

    it("random 4", () => {
      let json = `\
  [
    {
      "up": [
        -710146473.361948,
        -1527026341,
        -1514475872.6584358,
        "contrast",
        -897174894,
        true
      ],
      "organization": "dream",
      "national": -1995135445,
      "flies": "species",
      "president": -1197689665.214532,
      "her": null
    },
    -1689403418.6342025,
    "related",
    95397125.06454372,
    false,
    -657620507
  ]`;
      assert.deepStrictEqual(MYJSON.parse(json), JSON.parse(json));
    });
  });
});
