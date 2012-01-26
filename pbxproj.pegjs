{
    function merge(hash, secondHash) {
        secondHash = secondHash[0]
        for(var i in secondHash)
            hash[i] = secondHash[i]

        return hash;
    }
}

Project
  = headComment:SingleLineComment? obj:Object NewLine
    {
        var proj = Object.create(null)
        proj.project = obj

        if (headComment) {
            proj.headComment = headComment
        }

        return proj;
    }

Object
  = "{" obj:(AssignmentList / EmptyBody) "}"
    { return obj }

EmptyBody
  = _
    { return Object.create(null) }

AssignmentList
  = _ head:Assignment _ tail:((AssignmentList)*) _
    { 
      if (tail) return merge(head,tail)
      else return head
    }
    / _ section:DelimitedSection _
    {
        return section
    }

Assignment
  = SimpleAssignment / CommentedAssignment

SimpleAssignment
  = id:Identifier _ "=" _ val:Value ";"
    { 
      var result = Object.create(null);
      result[id] = val
      return result
    }

CommentedAssignment
  = commentedId:CommentedIdentifier _ "=" _ val:Value ";"
    {
        commentedId[commentedId.id] = val;
        delete(commentedId, 'id')
        return commentedId;
    }
    /
    id:Identifier _ "=" _ commentedVal:CommentedValue ";"
    {
        var result = Object.create(null);
        result[id] = commentedVal.value;
        result[id + "_comment"] = commentedVal.comment;
        return result;
    }

CommentedIdentifier
  = id:Identifier _ comment:InlineComment
    {
        var result = Object.create(null);
        result.id = id;
        result[id + "_comment"] = comment.trim();
        return result
    }

CommentedValue
  = literal:Literal _ comment:InlineComment
    {
        var result = Object.create(null)
        result.comment = comment.trim();
        result.value = literal.trim();
        return result;
    }

InlineComment
  = InlineCommentOpen body:[^*]+ InlineCommentClose
    { return body.join('') }

InlineCommentOpen
  = "/*"

InlineCommentClose
  = "*/"

DelimitedSection
  = begin:DelimitedSectionBegin _ fields:(AssignmentList / EmptyBody) _ DelimitedSectionEnd
    {
        var section = {}
        section[begin.name] = fields

        return section
    }

DelimitedSectionBegin
  = "/* Begin " sectionName:Identifier " section */" NewLine
    { return { name: sectionName } }

DelimitedSectionEnd
  = "/* End " sectionName:Identifier " section */" NewLine
    { return { name: sectionName } }

Identifier
  = id:[A-Za-z0-9]+
    { return id.join('') }

Value
  = obj:Object { return obj } / NumberValue / StringValue

Literal
  = StringValue

NumberValue
  = number:Digit+ { return parseInt(number, 10) }

Digit
  = [0-9]

StringValue
  = literal:LiteralChar+ { return literal.join('') }

LiteralChar
  = !InlineCommentOpen char:[^;\n]
    { return char }

SingleLineComment
  = "//" _ contents:OneLineString NewLine
    { return contents }

OneLineString
  = contents:NonLine*
    { return contents.join('') }

_ "whitespace"
  = whitespace*

whitespace
  = NewLine / [\t ]

NonLine
  = !NewLine char:Char
    { return char }

NewLine
    = [\n\r]

Char
  = .
