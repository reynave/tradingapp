SELECT f.id, d.id AS viewDetailId
FROM  journal_custom_field AS f
LEFT join journal_view_detail  AS d ON f.id = d.customFieldId