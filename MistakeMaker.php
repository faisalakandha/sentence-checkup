<?php

namespace Brisum\PunctuationChecker;

use Swagger\Client\Model\DocTag;

class MistakeMaker {

    public function createMistake($mistake, DocTag $docTag)
    {
        $suggestions = $docTag->getSuggestions();
        $mistakeCategory = str_replace($docTag->getReport(), '', $docTag->getCategory());

        return sprintf(
            '<span class="mistake-%s" title="%s">%s</span>',
            $mistakeCategory,
            $docTag->getHint(),
            $mistake
        );
    }
}
