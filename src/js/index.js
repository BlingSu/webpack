require('bootstrapcss')
require('indexcss')

require('mockIndex')

$(function() {
    $.ajax({
        url: '/data-list',
        type: 'get',
        success: function(res) {
            console.log('data===' + res)
        }
    })
})
