const Mock = require('mockjs')
Mock.mock('/data-list', 'get', {
    'list|1-3': [{
        'sid|+1': 1,
        'userId|5': '',
        'sex|1-2': true,
        'city|2-4': '@city',
        'grade|1': '@cword("男女")',
        'guid': '@guid',
        'id': '@id',
        'title': '@title()',
        'paragraph': '@paragraph',
        'image': '@image',
        'address': '@county(true)',
        'date': '@date("yyyy-MM-dd")',
        'time': '@time("HH:mm:ss")',
        'url': '@url',
        'email': '@email',
        'ip': '@ip',
        'regexp': /[a-z][A-Z][0-9]/,
    }]
})
